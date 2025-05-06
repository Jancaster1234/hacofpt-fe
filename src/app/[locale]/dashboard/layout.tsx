// src/app/[locale]/dashboard/layout.tsx
"use client";

import React from "react";
import { Sidebar } from "./_components/Sidebar";
import { RoleGuard } from "@/middleware/auth";
import { ReactNode, Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading protected content...</div>}>
      <RoleGuard allowedRoles={["TEAM_MEMBER", "TEAM_LEADER"]}>
        <div className="flex">
          <Sidebar />
          <main className="ml-64 flex-1 bg-gray-100 min-h-screen">
            {children}
          </main>
        </div>
      </RoleGuard>
    </Suspense>
  );
}
