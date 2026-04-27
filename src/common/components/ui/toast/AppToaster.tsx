"use client";

import { Toaster } from "sonner";

const AppToaster = () => {
  return (
    <Toaster
      theme="light"
      position="top-right"
      closeButton
      richColors
      expand
      visibleToasts={4}
      offset={20}
      gap={10}
      toastOptions={{
        duration: 4200,
        classNames: {
          toast: "ah-sonner-toast",
          title: "ah-sonner-title",
          description: "ah-sonner-description",
          actionButton: "ah-sonner-action",
          cancelButton: "ah-sonner-cancel",
          success: "ah-sonner-success",
          error: "ah-sonner-error",
          warning: "ah-sonner-warning",
          info: "ah-sonner-info",
        },
      }}
    />
  );
};

export default AppToaster;
