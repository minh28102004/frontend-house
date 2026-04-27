"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type ContactDrawerContextType = {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

const ContactDrawerContext = createContext<ContactDrawerContextType | undefined>(undefined);

export const useContactDrawer = () => {
  const context = useContext(ContactDrawerContext);
  if (!context) {
    throw new Error("useContactDrawer must be used within a ContactDrawerProvider");
  }
  return context;
};

export const ContactDrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => {
    setIsOpen(true);
    // Ngăn scroll body khi drawer mở
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const toggleDrawer = () => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <ContactDrawerContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </ContactDrawerContext.Provider>
  );
};

