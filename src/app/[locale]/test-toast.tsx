// src/app/[locale]/test-toast.tsx
"use client";

import { toast } from "sonner";
import { Toaster } from "sonner";

export default function TestToast() {
  return (
    <div className="p-4">
      <Toaster position="top-center" />
      <button
        onClick={() => toast.success("Direct toast test")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Test Direct Toast
      </button>
    </div>
  );
}
