"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { toast } from "@/common/utils/toast";
interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const {
    isAuthenticated,
    hasAdminAccess,
    user,
    verifyToken,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [checkAttempts, setCheckAttempts] = useState(0);

  useEffect(() => {
    // PhÃ¡t hiá»‡n token trong localStorage vÃ  Ä‘áº£m báº£o ngÆ°á»i dÃ¹ng Ä‘Ã£ Ä‘Æ°á»£c xÃ¡c thá»±c
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

      // Kiá»ƒm tra xem cÃ³ token trong localStorage khÃ´ng
      const hasToken = !!localStorage.getItem("token");

      if (!isAuthenticated) {
        if (hasToken && checkAttempts < 3) {
          return; // Äá»£i cho xÃ¡c thá»±c hoÃ n táº¥t á»Ÿ useEffect trÃªn
        }

        router.replace("/signin");
        return;
      }

      if (!hasAdminAccess()) {
        toast.error("You do not have access to the admin page");
        router.replace("/signin");
        return;
      }

      // Náº¿u lÃ  trang dashboard, cho phÃ©p truy cáº­p
      if (pathname === "/admin") {
        setIsChecking(false);
        return;
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [
    isAuthenticated,
    hasAdminAccess,
    router,
    pathname,
    user,
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

  if (!isAuthenticated || !hasAdminAccess()) {
    return null;
  }

  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default AdminGuard;

