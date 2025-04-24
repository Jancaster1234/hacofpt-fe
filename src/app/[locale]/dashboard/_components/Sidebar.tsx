// src/app/[locale]/dashboard/_components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  User,
  Users,
  Settings,
  BarChart2,
  Calendar,
  CreditCard,
} from "lucide-react";

const menuItems = [
  {
    href: "/dashboard/team-invitation",
    icon: Users,
    label: "Team invitations",
  },
  {
    href: "/dashboard/individual-registration",
    icon: User,
    label: "Individual registrations",
  },
  {
    href: "/dashboard/analytics",
    icon: BarChart2,
    label: "Analytics",
  },
  {
    href: "/dashboard/billing",
    icon: CreditCard,
    label: "Billing",
  },
  {
    href: "/dashboard/calendar",
    icon: Calendar,
    label: "Calendar",
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
  },
];

export function Sidebar() {
  return (
    <div className="fixed left-0 top-[142px] h-[calc(100vh-142px)] w-64 bg-white shadow-lg border-r border-gray-200 p-4 overflow-y-auto">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 group"
              >
                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-medium group-hover:text-blue-600">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
