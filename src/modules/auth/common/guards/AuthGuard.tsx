import React from "react";
import { useAuth } from "../repositories/authRepository";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/");
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
