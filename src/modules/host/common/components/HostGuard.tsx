"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { toast } from "@/common/utils/toast";

interface HostGuardProps {
  children: ReactNode;
}

const HostGuard = ({ children }: HostGuardProps) => {
  const {
    isAuthenticated,
    user,
    verifyToken,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [checkAttempts, setCheckAttempts] = useState(0);

  useEffect(() => {
    const ensureAuthenticated = async () => {
      const token = localStorage.getItem("token");
      if (token && !isAuthenticated && checkAttempts < 3) {
        await verifyToken(token);
        setCheckAttempts((prev) => prev + 1);
      }
    };

    ensureAuthenticated();
  }, [isAuthenticated, verifyToken, checkAttempts]);

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);

      const hasToken = !!localStorage.getItem("token");

      if (!isAuthenticated) {
        if (hasToken && checkAttempts < 3) {
          return;
        }
        router.replace("/signin");
        return;
      }

      // Kiá»ƒm tra role pháº£i lÃ  'host'
      if (user?.role !== "host") {
        toast.error("Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p trang Chá»§ nhÃ ");
        router.replace("/");
        return;
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [
    isAuthenticated,
    user,
    router,
    pathname,
    checkAttempts,
  ]);

  if (isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-3 mx-auto"></div>
          <p className="text-gray-600">Äang kiá»ƒm tra...</p>
          {checkAttempts > 0 && (
            <p className="text-gray-500 text-sm mt-2">
              Äang thá»­ láº¡i {checkAttempts}/3...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "host") {
    return null;
  }

  return <>{children}</>;
};

export default HostGuard;
