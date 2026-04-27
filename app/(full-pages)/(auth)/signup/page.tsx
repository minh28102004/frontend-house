import RegisterPage from "@/modules/auth/pages/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIGN UP",
  description: "Sign up for a new account",
};

export default function SignUpPage() {
  return <RegisterPage />;
}
