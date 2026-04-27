import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 sm:p-0">
      <ThemeProvider>
        <div className="relative flex w-full mt-20 justify-center items-center sm:p-0">
          {children}
        </div>
      </ThemeProvider>
    </div>
  );
}
