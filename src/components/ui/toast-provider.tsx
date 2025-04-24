// src/components/ui/toast-provider.tsx
"use client";

import { Toaster, toast } from "sonner";
import { useToastStore } from "@/store/toast-store";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    toasts.forEach((t) => {
      const { id, message, type, duration } = t;

      switch (type) {
        case "success":
          toast.success(message, {
            id,
            duration,
            onDismiss: () => removeToast(id),
          });
          break;
        case "error":
          toast.error(message, {
            id,
            duration,
            onDismiss: () => removeToast(id),
          });
          break;
        case "info":
          toast.info(message, {
            id,
            duration,
            onDismiss: () => removeToast(id),
          });
          break;
        case "warning":
          toast.warning(message, {
            id,
            duration,
            onDismiss: () => removeToast(id),
          });
          break;
      }
    });
  }, [toasts, removeToast]);

  return (
    <Toaster
      position="top-right"
      closeButton
      richColors
      expand={false}
      theme={(resolvedTheme as "light" | "dark") || "light"}
      className="overflow-hidden max-w-[90vw] sm:max-w-sm"
    />
  );
}
