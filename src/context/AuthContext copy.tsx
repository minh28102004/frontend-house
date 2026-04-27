"use client"; // Required to use hooks in the App Router

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { apiRoutes } from "../config/apiRoutes";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERIFY_TOKEN = `${API_URL}${apiRoutes.AUTH.VERIFY_TOKEN}`;

// User roles
type UserRole = "user" | "admin" | "staff" | "manager" | "technical";

// Permission interfaces
interface Permission {
  id: string;
  resource: string;
  action: string;
}

interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  fullName?: string;
  avatar?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasAdminAccess: () => boolean;
  verifyToken: (storedToken?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication state on every render
  useEffect(() => {
    // Function to check if the stored token is still valid
    const checkAuthState = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken && !isAuthenticated) {
        await verifyToken(storedToken);
      } else if (!storedToken && isAuthenticated) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    // Run the check
    checkAuthState();
  }, [isAuthenticated]); // Only depend on isAuthenticated to avoid infinite loops

  // Setup effect to load token from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for token in localStorage
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await verifyToken(storedToken);
        } else {
          console.warn("No token found in localStorage");
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      clearAuthSession();
    }
  }, []);

  const clearAuthSession = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  const verifyToken = async (storedToken?: string): Promise<void> => {
    const tokenToVerify = storedToken || token || localStorage.getItem("token");

    if (!tokenToVerify) {
      clearAuthSession();
      return;
    }

    try {
      const decodedToken = jwtDecode<{
        userId: string;
        email: string;
        role: UserRole;
        fullName?: string;
        avatar?: string;
        exp: number;
      }>(tokenToVerify);

      const currentTime = Math.floor(Date.now() / 1000);

      // Token hết hạn
      if (!decodedToken.exp || decodedToken.exp < currentTime) {
        clearAuthSession();
        router.replace("/signin");
        return;
      }

      const response = await fetch(API_VERIFY_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      if (!response.ok) {
        clearAuthSession();
        router.replace("/signin");
        return;
      }

      const data = await response.json();
      console.log(data);

      // Token hợp lệ
      setToken(tokenToVerify);
      localStorage.setItem("token", tokenToVerify);

      setUser({
        id: decodedToken.userId,
        email: decodedToken.email,
        role: decodedToken.role,
        fullName: decodedToken.fullName,
        avatar: decodedToken.avatar,
        permissions: [],
      });

      setIsAuthenticated(true);
    } catch (error) {
      // Token sai format / bị sửa / decode lỗi
      clearAuthSession();
      router.replace("/signin");
    }
  };

  // const verifyToken = async (storedToken?: string): Promise<void> => {
  //   const tokenToVerify = storedToken || token || localStorage.getItem("token");
  //   if (!tokenToVerify) {
  //     logout();
  //     return;
  //   }

  //   try {
  //     const decodedToken = jwtDecode<{
  //       userId: string;
  //       email: string;
  //       role: UserRole;
  //       fullName?: string;
  //       avatar?: string;
  //       exp: number;
  //     }>(tokenToVerify);

  //     // Check if token is expired
  //     const currentTime = Math.floor(Date.now() / 1000);
  //     if (decodedToken.exp && decodedToken.exp < currentTime) {
  //       logout();
  //       router.replace("/signin");
  //       return;
  //     }

  //     // Update token in state and localStorage
  //     setToken(tokenToVerify);
  //     localStorage.setItem("token", tokenToVerify);

  //     // Set basic user info from token
  //     const basicUser = {
  //       id: decodedToken.userId,
  //       email: decodedToken.email,
  //       role: decodedToken.role,
  //       fullName: decodedToken.fullName,
  //       avatar: decodedToken.avatar,
  //       permissions: [], // Will be populated by fetchUserPermissions
  //     };

  //     setUser(basicUser);
  //     setIsAuthenticated(true);

  //   } catch (error) {
  //     console.error("Token verification failed:", error);
  //     logout();
  //   }
  // };

  // const login = async (newToken: string) => {
  //   try {
  //     localStorage.setItem("token", newToken);
  //     setToken(newToken);

  //     const decodedToken = jwtDecode<{
  //       userId: string;
  //       email: string;
  //       role: UserRole;
  //       fullName?: string;
  //       avatar?: string;
  //     }>(newToken);

  //     // Set basic user info
  //     setUser({
  //       id: decodedToken.userId,
  //       email: decodedToken.email,
  //       role: decodedToken.role,
  //       fullName: decodedToken.fullName,
  //       avatar: decodedToken.avatar,
  //       permissions: [],
  //     });

  //     setIsAuthenticated(true);

  //     // Admin role or users with admin permissions go to admin dashboard
  //     if (decodedToken.role === "admin") {
  //       router.replace("/admin");
  //     } else if (
  //       ["staff", "manager", "technical"].includes(decodedToken.role)
  //     ) {
  //       // Staff, manager, technical go to admin but will see limited functionality
  //       router.replace("/admin");
  //     } else {
  //       // Regular users go to home
  //       router.replace("/");
  //     }
  //   } catch (error) {
  //     console.error("Token decode error during login:", error);
  //     logout();
  //   }
  // };
  const login = async (newToken: string) => {
    try {
      const decodedToken = jwtDecode<{
        userId: string;
        email: string;
        role: UserRole;
        fullName?: string;
        avatar?: string;
        exp: number;
      }>(newToken);

      const currentTime = Math.floor(Date.now() / 1000);
      if (!decodedToken.exp || decodedToken.exp < currentTime) {
        clearAuthSession();
        return;
      }

      localStorage.setItem("token", newToken);
      setToken(newToken);

      setUser({
        id: decodedToken.userId,
        email: decodedToken.email,
        role: decodedToken.role,
        fullName: decodedToken.fullName,
        avatar: decodedToken.avatar,
        permissions: [],
      });

      setIsAuthenticated(true);

      router.replace(["admin", "staff", "manager", "technical"].includes(decodedToken.role) ? "/admin" : "/");
    } catch {
      clearAuthSession();
    }
  };

  /**
   * Logout function clears the state and redirects to the home page for all users, including admin.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    router.replace("/signin");
  };

  /**
   * Check admin access based on the new roles.
   */
  const hasAdminAccess = (): boolean => {
    if (!user) {
      return false;
    }

    // Admin role always has access
    if (user.role === "admin") {
      return true;
    }

    // Staff, manager, technical roles get admin access but will see limited functionality
    if (["staff", "manager", "technical"].includes(user.role)) {
      return true;
    }

    // Allow access if user has at least one permission
    if (user.permissions && user.permissions.length > 0) {
      return true;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        verifyToken,
        login,
        logout,
        hasAdminAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for using the AuthContext in components.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
