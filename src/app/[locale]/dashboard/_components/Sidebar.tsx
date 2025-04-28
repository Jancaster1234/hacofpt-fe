"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import {
  Home,
  User,
  Users,
  Settings,
  BarChart2,
  Calendar,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

export function Sidebar() {
  const t = useTranslations("dashboard.sidebar");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isOpen) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const menuItems = [
    {
      href: "/dashboard/team-invitation",
      icon: Users,
      label: t("teamInvitations"),
    },
    {
      href: "/dashboard/individual-registration",
      icon: User,
      label: t("individualRegistrations"),
    },
    {
      href: "/dashboard/analytics",
      icon: BarChart2,
      label: t("analytics"),
    },
    {
      href: "/dashboard/billing",
      icon: CreditCard,
      label: t("billing"),
    },
    {
      href: "/dashboard/calendar",
      icon: Calendar,
      label: t("calendar"),
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: t("settings"),
    },
  ];

  // Mobile sidebar toggle button
  const MobileToggle = () => (
    <button
      onClick={toggleSidebar}
      className="fixed z-40 bottom-4 right-4 p-3 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-lg md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:bg-blue-700"
      aria-label={isOpen ? t("closeSidebar") : t("openSidebar")}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  // Desktop collapse button
  const CollapseButton = () => (
    <button
      onClick={toggleSidebar}
      className="hidden md:flex absolute -right-3 top-6 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-300"
      aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
    >
      {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </button>
  );

  return (
    <>
      <div
        className={`fixed left-0 top-[142px] h-[calc(100vh-142px)] z-30
          ${
            isMobile
              ? `${isOpen ? "translate-x-0" : "-translate-x-full"} w-64`
              : `${collapsed ? "w-16" : "w-64"}`
          }
          bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 
          p-4 overflow-y-auto transition-all duration-300 ease-in-out`}
      >
        <CollapseButton />
        <nav className="relative">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center ${collapsed && !isMobile ? "justify-center" : "justify-start space-x-3"} 
                             px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                             rounded-md transition-colors duration-200 group`}
                >
                  <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  {(!collapsed || isMobile) && (
                    <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <MobileToggle />
    </>
  );
}
