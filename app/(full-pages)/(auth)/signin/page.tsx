import LoginForm from "@/modules/auth/login/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIGN IN",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return <LoginForm />;
}
