// src/app/[locale]/dashboard/layout.tsx
"use client";

import React from "react";
import { Sidebar } from "./_components/Sidebar";
import { RoleGuard } from "@/middleware/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["TEAM_MEMBER", "TEAM_LEADER"]}>
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1 bg-gray-100 min-h-screen">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
