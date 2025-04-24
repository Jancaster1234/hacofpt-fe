// src/app/[locale]/user-dashboard/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMockUserHackathons } from "@/mocks/userHackathon.mock";
import HackathonList from "./_components/HackathonList";
import Filters from "./_components/Filters";
import SearchSortBar from "./_components/SearchSortBar";
import Pagination from "./_components/Pagination";
import { Hackathon } from "@/types/entities/hackathon";
import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "User Dashboard",
//   description: "View hackathons you have enrolled in.",
// };

const ITEMS_PER_PAGE = 6;

export default function UserDashboardPage() {
  const { user } = useAuthStore();
  const [enrolledHackathons, setEnrolledHackathons] = useState<Hackathon[]>([]);
  const [filters, setFilters] = useState<{
    enrollmentStatus: string[];
    categories: string[];
    organizations: string[];
  }>({
    enrollmentStatus: ["open"],
    categories: [],
    organizations: [],
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user) {
      const hackathons = getMockUserHackathons(user.id)?.hackathons.map(
        (h) => h.hackathon
      );
      setEnrolledHackathons(hackathons || []);
    }
  }, [user]);

  // Apply Filters & Memoize the Computation
  const filteredHackathons = useMemo(() => {
    return enrolledHackathons.filter((hackathon) => {
      const matchesStatus =
        filters.enrollmentStatus.length > 0
          ? filters.enrollmentStatus.includes(hackathon.enrollmentStatus)
          : true;
      const matchesCategory =
        filters.categories.length > 0
          ? filters.categories.some((category) =>
              hackathon.category.includes(category)
            )
          : true;
      const matchesOrganization =
        filters.organizations.length > 0
          ? filters.organizations.some((org) =>
              hackathon.organization.includes(org)
            )
          : true;

      return matchesStatus && matchesCategory && matchesOrganization;
    });
  }, [enrolledHackathons, filters]);

  // Pagination: Slice the filtered results
  const paginatedHackathons = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredHackathons.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHackathons, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Here are the hackathons you have enrolled in:
      </p>

      {enrolledHackathons.length > 0 ? (
        <div className="flex gap-4">
          {/* Sidebar Filters */}
          <div className="w-1/4">
            <Filters selectedFilters={filters} onFilterChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="w-3/4">
            <SearchSortBar />
            <HackathonList hackathons={paginatedHackathons ?? []} />
            <Pagination
              page={page}
              onPageChange={setPage}
              totalItems={filteredHackathons.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">
          You have not enrolled in any hackathons yet.
        </p>
      )}
    </div>
  );
}
