"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type PopupsContextType = {
  isOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
  togglePopup: () => void;
};

const PopupsContext = createContext<PopupsContextType | undefined>(undefined);

export const usePopups = () => {
  const context = useContext(PopupsContext);
  if (!context) {
    throw new Error("usePopups must be used within a PopupsProvider");
  }
  return context;
};

export const PopupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const togglePopup = () => {
    if (isOpen) closePopup();
    else openPopup();
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <PopupsContext.Provider value={{ isOpen, openPopup, closePopup, togglePopup }}>
      {children}
    </PopupsContext.Provider>
  );
};
