// src/app/[locale]/user-dashboard/_components/SearchSortBar.tsx
"use client";
import { useState } from "react";

export default function SearchSortBar() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("suggestion");

  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Search hackathons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-2/3"
      />
      <div className="relative">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A6CF7] focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 appearance-none cursor-pointer pr-8"
        >
          <option value="suggestion">Suggestion</option>
          <option value="latest">Latest</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
