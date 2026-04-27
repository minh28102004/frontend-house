"use client";
import { useState } from "react";
import { AuthResponse, loginAPI, registerAPI } from "../services/authService";

// Định nghĩa interface để tránh sử dụng any
interface CustomAxiosError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// 🆕 Khai báo type chuẩn cho LoginResponse
interface User {
  _id: string;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: AuthResponse = await loginAPI(email, password);

      // Nếu có user thì cập nhật state
      if (res.user) {
        setUser(res.user as User);
      }

      // Đã loại bỏ việc lưu token vào localStorage
    } catch (err: unknown) {
      const errorObj = err as CustomAxiosError;
      setError(
        errorObj.response?.data?.message ||
        errorObj.message ||
        "Đã có lỗi xảy ra!"
      );
      console.error("Lỗi đăng nhập:", errorObj);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    isHost: boolean = false,
    hostTermsAccepted: boolean = false
  ) => {
    setLoading(true);
    setError(null);
    try {
      await registerAPI(email, password, fullName, isHost, hostTermsAccepted);
    } catch (err: unknown) {
      const errorObj = err as CustomAxiosError;
      setError(
        errorObj.response?.data?.message ||
        errorObj.message ||
        "Đã có lỗi xảy ra!"
      );
      console.error("Lỗi đăng ký:", errorObj);
    } finally {
      setLoading(false);
    }
  };

  return { user, login, register, loading, error };
};
