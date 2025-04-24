// src/app/[locale]/account-setting/page.tsx
"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <LanguageSwitcher />
    </div>
  );
}
