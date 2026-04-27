"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const PREMIUM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.22, ease: PREMIUM_EASE }
          }
          className={`absolute right-0 z-[80] mt-2 rounded-[18px] border border-[var(--ah-border)] bg-[var(--ah-surface)] shadow-[0_20px_50px_rgba(25,22,20,0.12)] ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
