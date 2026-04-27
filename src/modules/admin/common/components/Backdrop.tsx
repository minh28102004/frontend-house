"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";

const Backdrop: React.FC = () => {
  const { isMobileOpen, closeMobileSidebar } = useSidebar();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <motion.button
          type="button"
          aria-label="Đóng menu điều hướng"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
          className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.35)] backdrop-blur-[2px] lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}
    </AnimatePresence>
  );
};

export default Backdrop;
