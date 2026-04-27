"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "../users/hooks/useUser";
import toast from "@/common/utils/toast";
import { handleGoogleCallback } from "../common/services/authService";
import { login } from "../common/repositories/authRepository";

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const EyeOpenIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Spinner = () => (
  <svg
    className="-ml-1 mr-2.5 h-4 w-4 animate-spin"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

function getLoginErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
}

const COLLAGE = [
  {
    src: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1740&auto=format&fit=crop",
    label: "Garden House",
    num: "01",
    tw: "absolute top-[14%] left-[4%] w-[54%] h-[36%] -rotate-[1.2deg]",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=800&auto=format&fit=crop&q=60",
    label: "Sky Cottage",
    num: "02",
    tw: "absolute top-[10%] right-[4%] w-[39%] h-[39%] rotate-[1.6deg]",
  },
  {
    src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60",
    label: "Cinema Lodge",
    num: "03",
    tw: "absolute bottom-[6%] left-[3%] w-[37%] h-[31%] rotate-[1deg]",
  },
  {
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    label: "Poolside Villa",
    num: "04",
    tw: "absolute bottom-[5%] right-[5%] w-[46%] h-[33%] -rotate-[1.6deg]",
  },
  {
    src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=60",
    label: "Signature Lounge",
    num: "05",
    tw: "absolute top-[44%] left-[28%] z-[2] w-[41%] h-[25%] rotate-[0.6deg] !rounded-[46px]",
  },
];

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login: authLogin } = useAuth();
  const { fetchUserInfo } = useUser();
  const searchParams = useSearchParams();

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0 && !isLoggingIn,
    [email, password, isLoggingIn]
  );

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      return;
    }

    if (token) {
      handleGoogleCallback(token)
        .then((response) => {
          authLogin(response.token);
          fetchUserInfo();
          toast.success("Đăng nhập bằng Google thành công!");
        })
        .catch((err) => {
          console.error("Google callback error:", err);
          toast.error("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
        });
    }
  }, [searchParams, authLogin, fetchUserInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      authLogin(response.token);
      await fetchUserInfo();

      toast.success("Đăng nhập thành công!");
    } catch (error: unknown) {
      console.error("Login error:", error);
      toast.error(getLoginErrorMessage(error));
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
 <main className="flex min-h-[calc(100dvh-74px)] w-full overflow-hidden bg-[#1a120b] font-sans text-[#1a120b]">
  <section
    className="relative hidden min-h-[calc(100dvh-74px)] overflow-hidden bg-[#0f0c09] lg:block lg:w-[54%] xl:w-[56%]"
    aria-hidden="true"
  >
        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-br from-[#0f0c09]/20 via-[#0f0c09]/5 to-[#0f0c09]/55" />
        <div className="pointer-events-none absolute -left-24 top-16 z-[4] h-72 w-72 rounded-full bg-[#c49a3c]/14 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 z-[4] h-96 w-96 rounded-full bg-[#8f7b4c]/12 blur-3xl" />

        <div className="absolute left-8 top-6 z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49a3c]/45 bg-[#c49a3c]/10 backdrop-blur-lg">
            <span className="font-serif text-[13px] font-medium tracking-[0.22em] text-[#c49a3c]">
              AH
            </span>
          </div>

          <div>
            <p className="font-serif text-[15px] font-medium leading-none tracking-[0.04em] text-white">
              Another House
            </p>
            <p className="mt-0.5 text-[9px] font-light uppercase tracking-[0.28em] text-white/40">
              Creative Boutique Homestay
            </p>
          </div>
        </div>

        <div className="absolute inset-0 z-[1] bg-[#0f0c09]">
          {COLLAGE.map((img, i) => (
            <div
              key={`${img.label}-${i}`}
              className={[
                "absolute overflow-hidden rounded-[18px]",
                "border-2 border-white/[0.07]",
                "shadow-[0_24px_60px_rgba(0,0,0,0.55),0_4px_12px_rgba(0,0,0,0.4)]",
                "transition-all duration-700 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:border-[#c49a3c]/35",
                img.tw,
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.label || `Room ${i + 1}`}
                className="h-full w-full object-cover object-center"
                draggable={false}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0704]/88 via-[#0a0704]/36 to-transparent px-3.5 pb-3 pt-8">
                <p className="text-[10px] font-light uppercase tracking-[0.22em] text-white/65">
                  {img.num}
                </p>
                <strong className="mt-0.5 block font-serif text-[15px] font-normal leading-tight text-white">
                  {img.label}
                </strong>
              </div>

              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          ))}
        </div>
      </section>

      <section className="relative flex flex-1 items-start justify-center overflow-y-auto bg-[#fdf9f3] px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-7">
        <div
          className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-px lg:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(196,154,60,0.2) 30%, rgba(196,154,60,0.2) 70%, transparent)",
          }}
        />

        <div className="w-full max-w-[520px]">
          <div className="relative rounded-[30px] border border-[#e7dccd] bg-[#fffdfa] p-4 shadow-[0_26px_80px_rgba(26,18,11,0.08)] sm:p-5 lg:-ml-3">
            <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-white/70" />

            <div className="relative">
              <div className="mb-5 text-center">
                <div className="mb-3 inline-flex items-center gap-[7px] rounded-full border border-[#d8c08a] bg-[#f9f1dd] px-3 py-[4px]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#c49a3c]" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#9a6f17]">
                    Another House Operations
                  </span>
                </div>

                <h1 className="font-serif text-[34px] font-semibold leading-none tracking-[-0.03em] text-[#18110c]">
                  Đăng nhập
                </h1>

                <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-normal leading-[1.7] text-[#7d6b5d]">
                  Chào mừng bạn quay lại. Đăng nhập để quản lý hệ thống vận hành
                  Another House.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#eadfce] bg-white p-5 shadow-[0_12px_36px_rgba(26,18,11,0.06)] sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#7a6352]">
                      Email <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="email"
                      value={email}
                      autoComplete="email"
                      placeholder="admin@anotherhouse.vn"
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-[44px] w-full rounded-[12px] border border-[#d8ccb9] bg-white px-4 text-[14px] font-normal text-[#1a120b] outline-none transition-all duration-200 placeholder:text-[#a99988] focus:border-[#c49a3c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,154,60,0.12)]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#7a6352]">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        autoComplete="current-password"
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-[44px] w-full rounded-[12px] border border-[#d8ccb9] bg-white px-4 pr-11 text-[14px] font-normal text-[#1a120b] outline-none transition-all duration-200 placeholder:text-[#a99988] focus:border-[#c49a3c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,154,60,0.12)]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 flex h-[32px] w-[32px] -translate-y-1/2 items-center justify-center rounded-[8px] text-[#8c7764] transition-all duration-200 hover:bg-[#f7efe0] hover:text-[#1a120b] focus:outline-none focus:ring-2 focus:ring-[#c49a3c]/25"
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                        }
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe((v) => !v)}
                        className="h-4 w-4 rounded border-[rgba(180,160,130,0.45)] text-[#c49a3c] focus:ring-[#c49a3c]"
                      />

                      <span className="text-[13px] font-normal text-[#5d4b3d]">
                        Giữ tôi đăng nhập
                      </span>
                    </label>

                    <Link
                      href="/forgot-password"
                      className="group relative inline-flex text-[13px] font-medium text-[#1a120b] transition-colors duration-300 hover:text-[#b8861b]"
                    >
                      <span>Quên mật khẩu?</span>
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#b8861b] transition-all duration-300 ease-out group-hover:w-full" />
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="group relative h-[46px] w-full overflow-hidden rounded-full bg-[#1b130c] text-[11.5px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_24px_rgba(26,18,11,0.18)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#2a1d12] hover:shadow-[0_14px_30px_rgba(26,18,11,0.22)] disabled:cursor-not-allowed disabled:bg-[#8f8a83] disabled:text-white/90 disabled:opacity-100 disabled:hover:translate-y-0"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#c49a3c]/18 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

                    <span className="relative flex items-center justify-center">
                      {isLoggingIn ? (
                        <>
                          <Spinner />
                          Đang đăng nhập...
                        </>
                      ) : (
                        "Đăng nhập"
                      )}
                    </span>
                  </button>
                </form>

                <div className="my-4 flex items-center gap-2.5">
                  <div className="h-px flex-1 bg-[#e5d8c7]" />
                  <span className="text-[11px] font-normal tracking-[0.1em] text-[#9a8471]">
                    hoặc tiếp tục với
                  </span>
                  <div className="h-px flex-1 bg-[#e5d8c7]" />
                </div>

                <button
                  type="button"
                  className="flex h-[44px] w-full items-center justify-center gap-2.5 rounded-full border border-[#ded2c0] bg-white text-[14px] font-medium text-[#1a120b] shadow-[0_2px_10px_rgba(26,18,11,0.04)] transition-all duration-200 hover:border-[#c49a3c]/50 hover:bg-[#fffaf2] hover:shadow-[0_6px_18px_rgba(26,18,11,0.06)] focus:outline-none focus:ring-2 focus:ring-[#c49a3c]/22"
                >
                  <GoogleIcon />
                  Đăng nhập với Google
                </button>
              </div>

              <p className="mt-4 text-center text-[13px] font-normal text-[#8e7865]">
                Chưa có tài khoản?{" "}
                <Link
                  href="/signup"
                  className="group relative inline-flex font-medium text-[#1a120b] transition-colors duration-300 hover:text-[#b8861b]"
                >
                  <span>Đăng ký ngay</span>
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#b8861b] transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
              </p>

          
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginForm;