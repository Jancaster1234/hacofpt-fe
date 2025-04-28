// src/components/Header/ThemeToggler.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility
  const t = useTranslations("theme");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown on click
        aria-label={t("themeToggle")}
        className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
      >
        {theme === "dark" ? (
          <svg
            className="w-5 h-5 text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2m0 14v2m8-8h2M3 12H1m15.071 6.071l1.414-1.414M5.515 5.515l1.414-1.414m11.142 1.414l-1.414-1.414M5.515 18.485l1.414 1.414"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m8-8h1M3 12H2m15.071 5.071l.707.707M5.515 5.515l-.707-.707m11.142.707l.707-.707M5.515 18.485l-.707.707"
            />
          </svg>
        )}
        <span className="text-sm">{t("theme")}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && ( // Only show when isOpen is true
        <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
          <button
            onClick={() => {
              setTheme("light");
              setIsOpen(false); // Close dropdown after selecting
            }}
            className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t("light")}
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t("dark")}
          </button>
          <button
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t("system")}
          </button>
        </div>
      )}
    </div>
  );
}
