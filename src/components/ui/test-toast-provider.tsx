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
    <Toaster position="top-right" theme={resolvedTheme as "light" | "dark"} />
  );
}
