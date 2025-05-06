// src/app/[locale]/chat/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["TEAM_MEMBER", "TEAM_LEADER"]}>
      {children}
    </RoleGuard>
  );
}
