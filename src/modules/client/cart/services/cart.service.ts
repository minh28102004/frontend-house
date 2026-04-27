import { API_URL_CLIENT } from '../../../../config/apiRoutes';
import { getAuthHeaders } from '../../../../config/api';

export interface CartItem {
  productId: string;
  productSlug: string;
  productName: string;
  productThumbnail?: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Cart {
  _id?: string;
  id?: string;
  userId: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  size?: string;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
  size?: string;
  newSize?: string;
}

const CART_API = '/api/cartapi';

export const CartService = {
  /**
   * Lấy giỏ hàng của user
   */
  getCart: async (): Promise<Cart> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('User chưa đăng nhập');
    }

    const response = await fetch(`${API_URL_CLIENT}${CART_API}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy giỏ hàng');
    }

    return response.json();
  },

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('User chưa đăng nhập');
    }

    const response = await fetch(`${API_URL_CLIENT}${CART_API}/add`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng');
    }

    return response.json();
  },

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   */
  updateCartItem: async (data: UpdateCartItemRequest): Promise<Cart> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('User chưa đăng nhập');
    }

    const response = await fetch(`${API_URL_CLIENT}${CART_API}/update-item`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Lỗi khi cập nhật giỏ hàng');
    }

    return response.json();
  },

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  removeFromCart: async (productId: string): Promise<Cart> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('User chưa đăng nhập');
    }

    const response = await fetch(`${API_URL_CLIENT}${CART_API}/remove/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng');
    }

    return response.json();
  },

  /**
   * Cập nhật toàn bộ giỏ hàng
   */
  updateCart: async (items: CartItem[]): Promise<Cart> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('User chưa đăng nhập');
    }

    const response = await fetch(`${API_URL_CLIENT}${CART_API}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Lỗi khi cập nhật giỏ hàng');
    }

    return response.json();
  },

  /**
   * Xóa toàn bộ giỏ hàng
   */
  clearCart: async (): Promise<Cart> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('User chưa đăng nhập');
    }

    const response = await fetch(`${API_URL_CLIENT}${CART_API}/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Lỗi khi xóa giỏ hàng');
    }

    return response.json();
  },
};

