// src/components/ui/test-toast-provider.tsx
"use client";

import { Toaster, toast } from "sonner";
import { useTheme } from "next-themes";

export function TestToastProvider() {
  const { resolvedTheme } = useTheme();

  // Expose the toast function globally for testing
  if (typeof window !== "undefined") {
    (window as any).testToast = {
      success: (msg: string) => toast.success(msg),
      error: (msg: string) => toast.error(msg),
    };
  }

  return (
    <Toaster
      position="bottom-right" // Different position to avoid conflicts
      closeButton
      richColors
      expand={false}
      theme={(resolvedTheme as "light" | "dark") || "light"}
      className="!z-[9999]" // Force highest z-index
      toastOptions={{
        style: {
          background: "rgba(0, 0, 0, 0.9)",
          color: "white",
          border: "2px solid white",
        },
      }}
    />
  );
}
