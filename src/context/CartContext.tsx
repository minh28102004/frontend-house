"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { CartService, CartItem, Cart } from "../modules/client/cart/services/cart.service";

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number, productInfo?: Partial<CartItem>) => Promise<void>;
  updateCartItem: (productId: string, quantity: number, size?: string, newSize?: string) => Promise<void>;
  removeFromCart: (productId: string, size?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCartFromLocalStorage: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = "anotherhouse_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart({
            userId: "",
            items: parsedCart.items || [],
          });
        } catch (e) {
          console.error("Error parsing cart from localStorage:", e);
        }
      }
    }
  }, [isAuthenticated]);

  // Load cart from API when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      setCart(null);
    }
  }, [isAuthenticated, user]);

  // Sync localStorage cart to database when user logs in
  const syncCartFromLocalStorage = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && parsedCart.items.length > 0) {
          // Sync each item to database
          for (const item of parsedCart.items) {
            try {
              await CartService.addToCart({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
              });
            } catch (e) {
              console.error("Error syncing cart item:", e);
            }
          }
          // Clear localStorage after syncing
          localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
          // Refresh cart from API
          await refreshCart();
        }
      }
    } catch (e) {
      console.error("Error syncing cart from localStorage:", e);
    }
  }, [isAuthenticated, user]);

  // Sync cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      syncCartFromLocalStorage();
    }
  }, [isAuthenticated, user, syncCartFromLocalStorage]);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    setError(null);
    try {
      const cartData = await CartService.getCart();
      setCart(cartData);
    } catch (e: any) {
      setError(e.message || "Lỗi khi tải giỏ hàng");
      console.error("Error loading cart:", e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const saveToLocalStorage = useCallback((items: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify({ items })
      );
    }
  }, []);

  const addToCart = useCallback(
  async (
    productId: string,
    quantity: number,
    productInfo?: Partial<CartItem>
  ) => {
    setError(null);

    if (isAuthenticated && user) {
      // Logged in: backend phải xử lý theo (productId + size)
      try {
        setIsLoading(true);
        const updatedCart = await CartService.addToCart({
          productId,
          quantity,
          size: productInfo?.size, // bắt buộc truyền size
        });
        setCart(updatedCart);
      } catch (e: any) {
        setError(e.message || "Lỗi khi thêm sản phẩm vào giỏ hàng");
        throw e;
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ===== Guest: localStorage =====
    if (!productInfo?.size) {
      throw new Error("Size là bắt buộc khi thêm vào giỏ hàng");
    }

    const currentItems = cart?.items || [];

    const existingItemIndex = currentItems.findIndex(
      (item) =>
        item.productId === productId &&
        item.size === productInfo.size
    );

    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Trùng product + size → cộng quantity
      newItems = [...currentItems];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity,
      };
    } else {
      // Khác size → thêm item mới
      newItems = [
        ...currentItems,
        {
          productId,
          productSlug: productInfo.productSlug || "",
          productName: productInfo.productName || "",
          productThumbnail: productInfo.productThumbnail,
          price: productInfo.price || 0,
          size: productInfo.size,
          quantity,
        },
      ];
    }

    const newCart: Cart = {
      userId: "",
      items: newItems,
    };

    setCart(newCart);
    saveToLocalStorage(newItems);
  },
  [isAuthenticated, user, cart, saveToLocalStorage]
);


  const updateCartItem = useCallback(
    async (productId: string, quantity: number, size?: string, newSize?: string) => {
      setError(null);
      const currentItems = cart?.items || [];

      // Find the item to update
      const itemIndex = currentItems.findIndex(
        (item) => item.productId === productId && (!size || item.size === size)
      );

      if (itemIndex === -1) {
        throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
      }

      let newItems: CartItem[];

      // Handle size change
      if (newSize && newSize !== size) {
        // Check if item with new size already exists
        const existingNewSizeIndex = currentItems.findIndex(
          (item) => item.productId === productId && item.size === newSize
        );

        if (existingNewSizeIndex >= 0) {
          // Merge quantities if item with new size exists
          newItems = currentItems.filter((_, idx) => idx !== itemIndex);
          newItems[existingNewSizeIndex >= itemIndex ? existingNewSizeIndex - 1 : existingNewSizeIndex].quantity += quantity;
        } else {
          // Create new item with new size
          newItems = [...currentItems];
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            size: newSize,
            quantity,
          };
        }
      } else {
        // Just update quantity
        newItems = [...currentItems];
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          quantity,
        };
      }

      // Optimistic update: Update UI immediately
      const newCart: Cart = {
        userId: cart?.userId || "",
        items: newItems,
      };
      setCart(newCart);
      saveToLocalStorage(newItems);

      // Then sync to database if authenticated
      if (isAuthenticated && user) {
        try {
          setIsLoading(true);
          const updatedCart = await CartService.updateCartItem({
            productId,
            quantity,
            size,
            newSize,
          });
          // Update with server response
          setCart(updatedCart);
        } catch (e: any) {
          // Rollback on error
          setCart(cart);
          saveToLocalStorage(currentItems);
          setError(e.message || "Lỗi khi cập nhật giỏ hàng");
          throw e;
        } finally {
          setIsLoading(false);
        }
      }
    },
    [isAuthenticated, user, cart, saveToLocalStorage]
  );

  const removeFromCart = useCallback(
    async (productId: string, size?: string) => {
      setError(null);
      const currentItems = cart?.items || [];

      // Optimistic update: Remove from UI immediately
      const newItems = currentItems.filter(
        (item) => !(item.productId === productId && (!size || item.size === size))
      );

      const newCart: Cart = {
        userId: cart?.userId || "",
        items: newItems,
      };
      setCart(newCart);
      saveToLocalStorage(newItems);

      // Then sync to database if authenticated
      if (isAuthenticated && user) {
        try {
          setIsLoading(true);
          const updatedCart = await CartService.removeFromCart(productId);
          setCart(updatedCart);
        } catch (e: any) {
          // Rollback on error
          setCart(cart);
          saveToLocalStorage(currentItems);
          setError(e.message || "Lỗi khi xóa sản phẩm khỏi giỏ hàng");
          throw e;
        } finally {
          setIsLoading(false);
        }
      }
    },
    [isAuthenticated, user, cart, saveToLocalStorage]
  );

  const clearCart = useCallback(async () => {
    setError(null);

    if (isAuthenticated && user) {
      // User is logged in - clear in database
      try {
        setIsLoading(true);
        const updatedCart = await CartService.clearCart();
        setCart(updatedCart);
      } catch (e: any) {
        setError(e.message || "Lỗi khi xóa giỏ hàng");
        throw e;
      } finally {
        setIsLoading(false);
      }
    } else {
      // User is not logged in - clear localStorage
      setCart({
        userId: "",
        items: [],
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      }
    }
  }, [isAuthenticated, user]);

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        totalPrice,
        isLoading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        syncCartFromLocalStorage,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
