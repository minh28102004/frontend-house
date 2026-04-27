"use client";

import { useMemo, useState } from "react";
import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "../common/hooks/useAuth";
import { checkEmailAPI } from "../common/services/authService";
import { EyeCloseIcon, EyeIcon } from "@/common/icons";

const HOST_TERMS = `
# ĐIỀU KHOẢN VÀ CHÍNH SÁCH DÀNH CHO CHỦ NHÀ

## 1. Điều khoản chung

Chào mừng bạn đến với nền tảng Another House. Khi đăng ký làm Chủ nhà trên nền tảng của chúng tôi, bạn đồng ý tuân thủ các điều khoản và chính sách được nêu dưới đây.

## 2. Quyền và nghĩa vụ của Chủ nhà

### 2.1 Quyền của Chủ nhà:
- Được quyền tạo và quản lý các phòng cho thuê trên nền tảng
- Được quyền thiết lập giá cả và các điều kiện thuê
- Được nhận thanh toán từ khách thuê
- Được quyền đánh giá và phản hồi về khách thuê

### 2.2 Nghĩa vụ của Chủ nhà:
- Cung cấp thông tin chính xác và đầy đủ về phòng cho thuê
- Đảm bảo phòng ở đúng như mô tả trên nền tảng
- Hỗ trợ khách thuê trong suốt thời gian thuê
- Tuân thủ các quy định pháp luật về cho thuê bất động sản
- Thanh toán các khoản phí theo quy định của nền tảng

## 3. Chính sách về phòng cho thuê

### 3.1 Đăng phòng:
- Thông tin phòng phải chính xác, không gây hiểu lầm
- Hình ảnh phải là thật, chụp tại phòng thực tế
- Giá cả phải được niêm yết rõ ràng, bao gồm các khoản phí

### 3.2 Quản lý phòng:
- Cập nhật tình trạng phòng thường xuyên
- Phản hồi yêu cầu đặt phòng trong thời gian quy định
- Xử lý khiếu nại của khách thuê một cách hợp lý

## 4. Thanh toán và hoa hồng

### 4.1 Thanh toán cho Chủ nhà:
- Thanh toán sẽ được chuyển vào tài khoản đã đăng ký
- Thời gian thanh toán: sau khi khách trả phòng thành công

### 4.2 Phí hoa hồng nền tảng:
- Nền tảng thu hoa hồng theo tỷ lệ % trên mỗi giao dịch
- Tỷ lệ hoa hồng sẽ được thông báo cụ thể tại thời điểm đăng ký

## 5. Trách nhiệm và bồi thường

### 5.1 Trách nhiệm của Chủ nhà:
- Chịu trách nhiệm về tính chính xác của thông tin phòng
- Chịu trách nhiệm khi xảy ra sự cố liên quan đến phòng cho thuê
- Bồi thường cho khách thuê nếu phòng không đúng như mô tả

### 5.2 Giới hạn trách nhiệm:
- Nền tảng không chịu trách nhiệm về các tranh chấp giữa Chủ nhà và Khách thuê
- Nền tảng chỉ đóng vai trò trung gian kết nối

## 6. Chấm dứt hợp tác

Nền tảng có quyền chấm dứt tài khoản Chủ nhà nếu:
- Vi phạm các điều khoản đã đồng ý
- Cung cấp thông tin sai lệch
- Có hành vi lừa đảo hoặc gây hại cho khách thuê
- Vi phạm pháp luật hiện hành

## 7. Thay đổi điều khoản

Nền tảng có quyền thay đổi các điều khoản này bất cứ lúc nào. Thông báo sẽ được gửi đến email đã đăng ký của Chủ nhà.

## 8. Liên hệ

Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email: support@anotherhouse.com

---

Bằng việc đánh dấu vào ô "Tôi đã đọc và đồng ý với các điều khoản trên", bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ tất cả các điều khoản và chính sách được nêu trên.
`;

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

type FieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  hostTerms?: string;
  submit?: string;
};

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

const AnimatedTextLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="group relative inline-flex font-medium text-[#1a120b] transition-colors duration-300 hover:text-[#b8861b]"
    >
      <span>{children}</span>
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#b8861b] transition-all duration-300 ease-out group-hover:w-full" />
    </Link>
  );
};

const TermsModal = ({
  isOpen,
  onClose,
  onAccept,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-8 sm:py-10">
      <button
        type="button"
        aria-label="Đóng điều khoản"
        className="absolute inset-0 bg-[#0f0c09]/62 backdrop-blur-[5px]"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[calc(100dvh-4rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-[#e7dccd] bg-[#fffdfa] shadow-[0_34px_100px_rgba(15,12,9,0.38)] sm:max-h-[calc(100dvh-5rem)]">
        <div className="flex items-start justify-between gap-5 border-b border-[#eadfce] px-5 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#b8861b]">
              Host policy
            </p>

            <h2 className="text-[24px] font-semibold uppercase leading-tight tracking-[0.04em] text-[#18110c] sm:text-[28px]">
              Điều khoản dành cho Chủ nhà
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e7dccd] bg-white text-[#8c7764] transition hover:border-[#c49a3c]/50 hover:bg-[#fff8e8] hover:text-[#1a120b]"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
          <div className="space-y-1 text-[#5f5144]">
            {HOST_TERMS.split("\n").map((line, i) => {
              if (line.startsWith("# ")) return null;

              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="mt-7 text-[17px] font-bold uppercase tracking-[0.16em] text-[#9a6f17]"
                  >
                    {line.replace("## ", "")}
                  </h2>
                );
              }

              if (line.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="mt-5 text-[15px] font-bold uppercase tracking-[0.04em] text-[#18110c]"
                  >
                    {line.replace("### ", "")}
                  </h3>
                );
              }

              if (line.trim() === "") {
                return <div key={i} className="h-1" />;
              }

              if (line.startsWith("- ")) {
                return (
                  <li
                    key={i}
                    className="ml-6 text-[15px] leading-8 text-[#66594d]"
                  >
                    {line.replace("- ", "")}
                  </li>
                );
              }

              return (
                <p key={i} className="text-[15px] leading-8 text-[#66594d]">
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#eadfce] bg-[#fffdfa] px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={onAccept}
            className="group relative h-[52px] w-full overflow-hidden rounded-full bg-[#1b130c] text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_26px_rgba(26,18,11,0.18)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#2a1d12] hover:shadow-[0_16px_34px_rgba(26,18,11,0.24)]"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#c49a3c]/18 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative">Tôi đã đọc và đồng ý với điều khoản</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const { register, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [isHost, setIsHost] = useState(false);
  const [showHostTerms, setShowHostTerms] = useState(false);
  const [hostTermsAccepted, setHostTermsAccepted] = useState(false);

  const isValidEmailFormat = (value: string): boolean => {
    const atIndex = value.indexOf("@");
    if (atIndex === -1) return false;

    const domainPart = value.slice(atIndex + 1);
    return domainPart.includes(".");
  };

  const canSubmit = useMemo(() => {
    const hasRequiredFields =
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      confirmPassword.trim().length > 0 &&
      isChecked;

    const emailLooksValid = isValidEmailFormat(email.trim());
    const passwordLooksValid = password.length >= 6;
    const passwordMatched = password === confirmPassword;
    const hostReady = !isHost || hostTermsAccepted;

    return (
      hasRequiredFields &&
      emailLooksValid &&
      passwordLooksValid &&
      passwordMatched &&
      hostReady &&
      !loading &&
      !isCheckingEmail
    );
  }, [
    fullName,
    email,
    password,
    confirmPassword,
    isChecked,
    isHost,
    hostTermsAccepted,
    loading,
    isCheckingEmail,
  ]);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const getLocalValidationErrors = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên.";
    }

    if (!email.trim()) {
      errors.email = "Vui lòng nhập email.";
    } else if (!isValidEmailFormat(email.trim())) {
      errors.email = "Email không hợp lệ.";
    }

    if (password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (!isChecked) {
      errors.terms = "Bạn cần đồng ý với điều khoản và chính sách bảo mật.";
    }

    if (isHost && !hostTermsAccepted) {
      errors.hostTerms =
        "Bạn phải đồng ý với điều khoản Chủ nhà để đăng ký làm Chủ nhà.";
    }

    return errors;
  };

  const handleHostToggle = () => {
    if (!isHost) {
      setShowHostTerms(true);
      return;
    }

    setIsHost(false);
    setHostTermsAccepted(false);
    clearFieldError("hostTerms");
  };

  const handleAcceptHostTerms = () => {
    setHostTermsAccepted(true);
    setIsHost(true);
    setShowHostTerms(false);
    clearFieldError("hostTerms");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    setHasSubmitted(true);

    const localErrors = getLocalValidationErrors();

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    setFieldErrors({});
    setIsCheckingEmail(true);

    try {
      const { isValid } = await checkEmailAPI(email.trim());

      if (!isValid) {
        setFieldErrors({ email: "Email đã được sử dụng." });
        return;
      }
    } catch (error) {
      console.error("Lỗi kiểm tra email:", error);
      setFieldErrors({ email: "Lỗi kiểm tra email. Vui lòng thử lại." });
      return;
    } finally {
      setIsCheckingEmail(false);
    }

    try {
      await register(
        email.trim(),
        password,
        fullName.trim(),
        isHost,
        hostTermsAccepted
      );

      router.push("/signin");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setFieldErrors({
        submit: "Đăng ký thất bại. Vui lòng thử lại.",
      });
    }
  };

  const showError = (field: keyof FieldErrors) =>
    hasSubmitted && fieldErrors[field];

  const isSubmitting = loading || isCheckingEmail;

  return (
    <>
      <TermsModal
        isOpen={showHostTerms}
        onClose={() => setShowHostTerms(false)}
        onAccept={handleAcceptHostTerms}
      />

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

        <section className="relative flex w-full items-start justify-center overflow-y-auto bg-[#fdf9f3] px-5 py-5 sm:px-8 sm:py-6 lg:w-[46%] lg:px-8 lg:py-7 xl:w-[44%]">
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-px lg:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(196,154,60,0.2) 30%, rgba(196,154,60,0.2) 70%, transparent)",
            }}
          />

          <div className="w-full max-w-[470px] xl:max-w-[460px]">
            <div className="relative rounded-[30px] border border-[#e7dccd] bg-[#fffdfa] p-4 shadow-[0_26px_80px_rgba(26,18,11,0.08)] sm:p-5 lg:-ml-6">
              <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-white/70" />

              <div className="relative">
                <div className="mb-5 text-center">
                  <div className="mb-3 inline-flex items-center gap-[7px] rounded-full border border-[#d8c08a] bg-[#f9f1dd] px-3 py-[4px]">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#c49a3c]" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#9a6f17]">
                      Another House Account
                    </span>
                  </div>

                  <h1 className="font-serif text-[34px] font-semibold leading-none tracking-[-0.03em] text-[#18110c]">
                    Đăng ký
                  </h1>

                  <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-normal leading-[1.7] text-[#7d6b5d]">
                    Tạo tài khoản để đặt phòng, theo dõi lịch lưu trú hoặc đăng
                    ký vận hành phòng trên Another House.
                  </p>
                </div>

                <div className="rounded-[20px] border border-[#eadfce] bg-white p-5 shadow-[0_12px_36px_rgba(26,18,11,0.06)] sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#7a6352]">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          clearFieldError("fullName");
                          clearFieldError("submit");
                        }}
                        placeholder="Nhập họ và tên"
                        className={`h-[44px] w-full rounded-[12px] border bg-white px-4 text-[14px] font-normal text-[#1a120b] outline-none transition-all duration-200 placeholder:text-[#a99988] focus:bg-white ${
                          showError("fullName")
                            ? "border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]"
                            : "border-[#d8ccb9] focus:border-[#c49a3c] focus:shadow-[0_0_0_4px_rgba(196,154,60,0.12)]"
                        }`}
                      />

                      {showError("fullName") && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {fieldErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#7a6352]">
                        Email <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearFieldError("email");
                          clearFieldError("submit");
                        }}
                        placeholder="you@example.com"
                        className={`h-[44px] w-full rounded-[12px] border bg-white px-4 text-[14px] font-normal text-[#1a120b] outline-none transition-all duration-200 placeholder:text-[#a99988] focus:bg-white ${
                          showError("email")
                            ? "border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]"
                            : "border-[#d8ccb9] focus:border-[#c49a3c] focus:shadow-[0_0_0_4px_rgba(196,154,60,0.12)]"
                        }`}
                      />

                      {showError("email") && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#7a6352]">
                          Mật khẩu <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              clearFieldError("password");
                              clearFieldError("confirmPassword");
                              clearFieldError("submit");
                            }}
                            placeholder="Tối thiểu 6 ký tự"
                            className={`h-[44px] w-full rounded-[12px] border bg-white px-4 pr-10 text-[14px] font-normal text-[#1a120b] outline-none transition-all duration-200 placeholder:text-[#a99988] focus:bg-white ${
                              showError("password")
                                ? "border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]"
                                : "border-[#d8ccb9] focus:border-[#c49a3c] focus:shadow-[0_0_0_4px_rgba(196,154,60,0.12)]"
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2.5 top-1/2 flex h-[32px] w-[32px] -translate-y-1/2 items-center justify-center rounded-[8px] text-[#8c7764] transition hover:bg-[#f7efe0] hover:text-[#1a120b]"
                            aria-label={
                              showPassword
                                ? "Ẩn mật khẩu"
                                : "Hiển thị mật khẩu"
                            }
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-current" />
                            ) : (
                              <EyeCloseIcon className="fill-current" />
                            )}
                          </button>
                        </div>

                        {showError("password") && (
                          <p className="mt-1.5 text-xs text-red-500">
                            {fieldErrors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#7a6352]">
                          Xác nhận <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              clearFieldError("confirmPassword");
                              clearFieldError("submit");
                            }}
                            placeholder="Nhập lại mật khẩu"
                            className={`h-[44px] w-full rounded-[12px] border bg-white px-4 pr-10 text-[14px] font-normal text-[#1a120b] outline-none transition-all duration-200 placeholder:text-[#a99988] focus:bg-white ${
                              showError("confirmPassword")
                                ? "border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]"
                                : "border-[#d8ccb9] focus:border-[#c49a3c] focus:shadow-[0_0_0_4px_rgba(196,154,60,0.12)]"
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((v) => !v)
                            }
                            className="absolute right-2.5 top-1/2 flex h-[32px] w-[32px] -translate-y-1/2 items-center justify-center rounded-[8px] text-[#8c7764] transition hover:bg-[#f7efe0] hover:text-[#1a120b]"
                            aria-label={
                              showConfirmPassword
                                ? "Ẩn mật khẩu xác nhận"
                                : "Hiển thị mật khẩu xác nhận"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeIcon className="fill-current" />
                            ) : (
                              <EyeCloseIcon className="fill-current" />
                            )}
                          </button>
                        </div>

                        {showError("confirmPassword") && (
                          <p className="mt-1.5 text-xs text-red-500">
                            {fieldErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`rounded-[14px] border bg-[#fff8e8] p-3.5 shadow-[0_4px_16px_rgba(196,154,60,0.06)] ${
                        showError("hostTerms")
                          ? "border-red-300"
                          : "border-[#e2c98d]"
                      }`}
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isHost}
                          onChange={handleHostToggle}
                          className="mt-0.5 h-4 w-4 rounded border-[#d6b66f] text-[#c49a3c] focus:ring-[#c49a3c]"
                        />

                        <span>
                          <span className="block text-sm font-medium text-[#1a120b]">
                            Đăng ký làm Chủ nhà
                          </span>

                          <span className="mt-1 block text-xs leading-5 text-[#7a6352]">
                            Quản lý phòng cho thuê và nhận đặt phòng trên
                            Another House.
                          </span>

                          {isHost && hostTermsAccepted && (
                            <span className="mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                              Đã đồng ý điều khoản Chủ nhà
                            </span>
                          )}
                        </span>
                      </label>
                    </div>

                    {showError("hostTerms") && (
                      <p className="-mt-2 text-xs text-red-500">
                        {fieldErrors.hostTerms}
                      </p>
                    )}

                    <div>
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setIsChecked((v) => !v);
                            clearFieldError("terms");
                            clearFieldError("submit");
                          }}
                          className="mt-0.5 h-4 w-4 rounded border-[rgba(180,160,130,0.45)] text-[#c49a3c] focus:ring-[#c49a3c]"
                        />

                        <span className="text-xs leading-5 text-[#7a6352]">
                          Tôi đồng ý với{" "}
                          <span onClick={(e) => e.stopPropagation()}>
                            <AnimatedTextLink href="/terms">
                              Điều khoản sử dụng
                            </AnimatedTextLink>
                          </span>{" "}
                          và{" "}
                          <span onClick={(e) => e.stopPropagation()}>
                            <AnimatedTextLink href="/privacy-policy">
                              Chính sách bảo mật
                            </AnimatedTextLink>
                          </span>
                          .
                        </span>
                      </label>

                      {showError("terms") && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {fieldErrors.terms}
                        </p>
                      )}
                    </div>

                    {showError("submit") && (
                      <div className="rounded-[12px] border border-red-100 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                        {fieldErrors.submit}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="group relative h-[46px] w-full overflow-hidden rounded-full bg-[#1b130c] text-[11.5px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_24px_rgba(26,18,11,0.18)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#2a1d12] hover:shadow-[0_14px_30px_rgba(26,18,11,0.22)] disabled:cursor-not-allowed disabled:bg-[#8f8a83] disabled:text-white/90 disabled:opacity-100 disabled:hover:translate-y-0"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#c49a3c]/18 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

                      <span className="relative flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <Spinner />
                            {isCheckingEmail
                              ? "Đang kiểm tra email..."
                              : "Đang đăng ký..."}
                          </>
                        ) : isHost ? (
                          "Đăng ký làm Chủ nhà"
                        ) : (
                          "Đăng ký"
                        )}
                      </span>
                    </button>
                  </form>
                </div>

                <p className="mt-4 text-center text-[13px] font-normal text-[#8e7865]">
                  Đã có tài khoản?{" "}
                  <AnimatedTextLink href="/signin">
                    Đăng nhập ngay
                  </AnimatedTextLink>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default RegisterForm;