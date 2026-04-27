"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type CartModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
};

const CartModalContext = createContext<CartModalContextType | undefined>(undefined);

export const useCartModal = () => {
  const context = useContext(CartModalContext);
  if (!context) {
    throw new Error("useCartModal must be used within a CartModalProvider");
  }
  return context;
};

export const CartModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const toggleModal = () => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <CartModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        toggleModal,
      }}
    >
      {children}
    </CartModalContext.Provider>
  );
};

