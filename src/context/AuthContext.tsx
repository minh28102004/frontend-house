"use client"; // Required to use hooks in the App Router

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { fetchUserByToken } from "@/modules/auth/common/services/authService";

// User roles
type UserRole = "user" | "admin" | "staff" | "manager" | "technical" | "host";

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
  /** Đồng bộ fullName / avatar từ API /me (JWT có thể thiếu hoặc cũ sau khi đổi ảnh) */
  refreshUserProfile: () => Promise<void>;
  /** Cập nhật tên & avatar trên context sau khi PUT profile (tránh chờ JWT mới) */
  syncAuthUserFromProfile: (patch: { fullName?: string; avatar?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function mergeUserFromMeApi(authToken: string, base: User): Promise<User> {
  try {
    const profile = await fetchUserByToken(authToken);
    const avatarFromApi =
      typeof profile.avatar === "string" && profile.avatar.trim()
        ? profile.avatar.trim()
        : base.avatar;
    const fullNameFromApi = profile.fullName?.trim() || base.fullName;
    return {
      ...base,
      fullName: fullNameFromApi,
      avatar: avatarFromApi,
    };
  } catch {
    return base;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const syncAuthUserFromProfile = useCallback(
    (patch: { fullName?: string; avatar?: string }) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev };
        if (patch.fullName !== undefined) next.fullName = patch.fullName;
        if (patch.avatar !== undefined) next.avatar = patch.avatar;
        return next;
      });
    },
    [],
  );

  const refreshUserProfile = useCallback(async () => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!t) return;
    setUser((prev) => {
      if (!prev) return prev;
      void mergeUserFromMeApi(t, prev).then(setUser);
      return prev;
    });
  }, []);

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

  const verifyToken = async (storedToken?: string): Promise<void> => {
    const tokenToVerify = storedToken || token || localStorage.getItem("token");
    if (!tokenToVerify) {
      logout();
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

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        logout();
        router.replace("/signin");
        return;
      }

      // Update token in state and localStorage
      setToken(tokenToVerify);
      localStorage.setItem("token", tokenToVerify);

      // Set basic user info from token
      const basicUser = {
        id: decodedToken.userId,
        email: decodedToken.email,
        role: decodedToken.role,
        fullName: decodedToken.fullName,
        avatar: decodedToken.avatar,
        permissions: [], // Will be populated by fetchUserPermissions
      };

      const mergedUser = await mergeUserFromMeApi(tokenToVerify, basicUser);
      setUser(mergedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    }
  };

  const login = async (newToken: string) => {
    try {
      localStorage.setItem("token", newToken);
      setToken(newToken);

      const decodedToken = jwtDecode<{
        userId: string;
        email: string;
        role: UserRole;
        fullName?: string;
        avatar?: string;
      }>(newToken);

      const basicUser = {
        id: decodedToken.userId,
        email: decodedToken.email,
        role: decodedToken.role,
        fullName: decodedToken.fullName,
        avatar: decodedToken.avatar,
        permissions: [] as Permission[],
      };
      const mergedUser = await mergeUserFromMeApi(newToken, basicUser);
      setUser(mergedUser);
      setIsAuthenticated(true);

      // Admin role or users with admin permissions go to admin dashboard
      if (decodedToken.role === "admin") {
        router.replace("/admin");
      } else if (
        ["staff", "manager", "technical"].includes(decodedToken.role)
      ) {
        // Staff, manager, technical go to admin but will see limited functionality
        router.replace("/admin");
      } else if (decodedToken.role === "host") {
        // Host goes to their own dashboard
        router.replace("/host");
      } else {
        // Regular users go to home
        router.replace("/");
      }
    } catch (error) {
      console.error("Token decode error during login:", error);
      logout();
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

    // Host has limited admin access (can manage their own rooms)
    if (user.role === "host") {
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
        refreshUserProfile,
        syncAuthUserFromProfile,
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
