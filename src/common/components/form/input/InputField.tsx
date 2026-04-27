import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  success?: boolean;
  error?: boolean;
  hint?: string; // Optional hint text
}

const Input = ({
  type = "text",
  className = "",
  disabled = false,
  success = false,
  error = false,
  hint,
  ...rest
}: InputProps) => {
  // Determine input styles based on state (disabled, success, error)
  let inputClasses = `h-10 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-xs placeholder:text-[var(--ah-muted-2)] focus:outline-hidden focus:ring-4 ${className}`;

  // Add styles for the different states
  if (disabled) {
    inputClasses += ` text-[var(--ah-muted)] border-[var(--ah-border)] cursor-not-allowed bg-[var(--ah-surface-2)]`;
  } else if (error) {
    inputClasses += ` text-[var(--ah-danger)] border-[var(--ah-danger)] focus:ring-[var(--ah-danger-soft)]`;
  } else if (success) {
    inputClasses += ` text-[var(--ah-success)] border-[var(--ah-success)] focus:ring-[var(--ah-success-soft)]`;
  } else {
    inputClasses += ` bg-white text-gray-900 border-[#d9d9d9] focus:border-[#4096ff] focus:ring-[rgba(22,119,255,0.15)]`;
  }

  return (
    <div className="relative">
      <input
        type={type}
        disabled={disabled}
        className={inputClasses}
        {...rest}
      />

      {/* Optional Hint Text */}
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-[var(--ah-danger)]"
              : success
              ? "text-[var(--ah-success)]"
              : "text-[var(--ah-muted)]"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
