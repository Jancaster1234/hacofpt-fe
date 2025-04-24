// src/app/[locale]/dashboard/layout.tsx
"use client";

import React from "react";
import { Sidebar } from "./_components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 bg-gray-100 min-h-screen">{children}</main>
    </div>
  );
}
