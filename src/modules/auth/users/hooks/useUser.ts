import { useState, useEffect, useCallback } from "react";
import { User, UserAddress, UserSettings } from "../models/user.model";
import { UserService } from "../services/user.service";
import { useAuth } from "@/context/AuthContext";

// 🧑‍💼 Hook quản lý thông tin người dùng
export const useUser = () => {
  const { isAuthenticated, syncAuthUserFromProfile } = useAuth();

  // 🔄 States
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 📌 Lấy thông tin người dùng hiện tại
  const fetchUserInfo = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const userData = await UserService.getCurrentUser();
      setUser(userData);
    } catch (err: any) {
      setError(err.message || "Không thể lấy thông tin người dùng");
      console.error("Lỗi khi lấy thông tin người dùng:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // 📌 Cập nhật thông tin người dùng
  const updateUserInfo = useCallback(async (userData: Partial<User>) => {
    if (!isAuthenticated || !user) return null;

    setIsUpdating(true);
    setError(null);

    try {
      const updatedUser = await UserService.updateUserInfo(userData);
      setUser(updatedUser);
      syncAuthUserFromProfile({
        fullName: updatedUser.fullName,
        avatar: updatedUser.avatar,
      });
      return updatedUser;
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật thông tin");
      console.error("Lỗi khi cập nhật thông tin người dùng:", err);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated, user, syncAuthUserFromProfile]);

  // 📌 Thay đổi mật khẩu
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!isAuthenticated) return false;

    setIsUpdating(true);
    setError(null);

    try {
      await UserService.changePassword(currentPassword, newPassword);
      return true;
    } catch (err: any) {
      // Cập nhật thông báo lỗi để hiển thị chi tiết hơn
      const errorMessage = err.message || "Không thể đổi mật khẩu";
      setError(errorMessage);
      console.error("Lỗi khi đổi mật khẩu:", err);
      // Ném lỗi để component xử lý
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated]);

  // 📌 Upload avatar
  const uploadAvatar = useCallback(async (file: File) => {
    if (!isAuthenticated || !user) return null;

    setIsUpdating(true);
    setError(null);

    try {
      const { url } = await UserService.uploadAvatar(file);
      // Cập nhật user với avatar mới
      await updateUserInfo({ avatar: url });
      return url;
    } catch (err: any) {
      setError(err.message || "Không thể tải lên ảnh đại diện");
      console.error("Lỗi khi upload avatar:", err);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated, user, updateUserInfo]);

  // 📌 Lấy danh sách địa chỉ
  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      // const addressList = await UserService.getUserAddresses();
      // setAddresses(addressList);
    } catch (err: any) {
      setError(err.message || "Không thể lấy danh sách địa chỉ");
      console.error("Lỗi khi lấy danh sách địa chỉ:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // 📌 Thêm địa chỉ mới
  // const addAddress = useCallback(async (address: Omit<UserAddress, 'id'>) => {
  //   if (!isAuthenticated) return null;

  //   setIsUpdating(true);
  //   setError(null);

  //   try {
  //     // const newAddress = await UserService.addAddress(address);
  //     setAddresses(prev => [...prev, newAddress]);
  //     return newAddress;
  //   } catch (err: any) {
  //     setError(err.message || "Không thể thêm địa chỉ mới");
  //     console.error("Lỗi khi thêm địa chỉ mới:", err);
  //     return null;
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // }, [isAuthenticated]);

  // 📌 Cập nhật địa chỉ
  // const updateAddress = useCallback(async (id: string, address: Partial<UserAddress>) => {
  //   if (!isAuthenticated) return null;

  //   setIsUpdating(true);
  //   setError(null);

  //   try {
  //     // const updatedAddress = await UserService.updateAddress(id, address);
  //     setAddresses(prev => prev.map(addr => addr.id === id ? updatedAddress : addr));
  //     return updatedAddress;
  //   } catch (err: any) {
  //     setError(err.message || "Không thể cập nhật địa chỉ");
  //     console.error(`Lỗi khi cập nhật địa chỉ ${id}:`, err);
  //     return null;
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // }, [isAuthenticated]);

  // 📌 Xóa địa chỉ
  const deleteAddress = useCallback(async (id: string) => {
    if (!isAuthenticated) return false;

    setIsUpdating(true);
    setError(null);

    try {
      // await UserService.deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || "Không thể xóa địa chỉ");
      console.error(`Lỗi khi xóa địa chỉ ${id}:`, err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated]);

  // 📌 Đặt địa chỉ mặc định
  const setDefaultAddress = useCallback(async (id: string) => {
    if (!isAuthenticated) return false;

    setIsUpdating(true);
    setError(null);

    try {
      // await UserService.setDefaultAddress(id);
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
      return true;
    } catch (err: any) {
      setError(err.message || "Không thể đặt địa chỉ mặc định");
      console.error(`Lỗi khi đặt địa chỉ ${id} làm mặc định:`, err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated]);

  // 📌 Lấy cài đặt người dùng
  const fetchUserSettings = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const userSettings = await UserService.getUserSettings();
      setSettings(userSettings);
    } catch (err: any) {
      setError(err.message || "Không thể lấy cài đặt người dùng");
      console.error("Lỗi khi lấy cài đặt người dùng:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // 📌 Cập nhật cài đặt người dùng
  const updateUserSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    if (!isAuthenticated) return null;

    setIsUpdating(true);
    setError(null);

    try {
      const updatedSettings = await UserService.updateUserSettings(newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật cài đặt");
      console.error("Lỗi khi cập nhật cài đặt người dùng:", err);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated]);

  // 🔄 Lấy dữ liệu khi component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
      fetchAddresses();
      fetchUserSettings();
    }
  }, [isAuthenticated, fetchUserInfo, fetchAddresses, fetchUserSettings]);

  return {
    user,
    addresses,
    settings,
    isLoading,
    isUpdating,
    error,
    fetchUserInfo,
    updateUserInfo,
    changePassword,
    uploadAvatar,
    fetchAddresses,
    // addAddress,
    // updateAddress,
    deleteAddress,
    setDefaultAddress,
    fetchUserSettings,
    updateUserSettings,
  };
};