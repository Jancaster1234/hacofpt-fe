// src/app/[locale]/user-dashboard/_components/Filters.tsx
"use client";

const categories = [
  "Coding Hackathons",
  "External Hackathons",
  "Internal Hackathons",
  "Design Hackathons",
  "Others",
];

const organizations = [
  "FPTU",
  "NASA",
  "IAI HACKATHON",
  "CE Hackathon",
  "Others",
];

const enrollmentStatusOptions = ["upcoming", "open", "closed"];

type FiltersProps = {
  selectedFilters: {
    enrollmentStatus: string[];
    categories: string[];
    organizations: string[];
  };
  onFilterChange: (filters: {
    enrollmentStatus: string[];
    categories: string[];
    organizations: string[];
  }) => void;
};

export default function Filters({
  selectedFilters,
  onFilterChange,
}: FiltersProps) {
  const {
    enrollmentStatus,
    categories: selectedCategories,
    organizations: selectedOrganizations,
  } = selectedFilters;

  const toggleSelection = (
    value: string,
    state: string[],
    key: "categories" | "organizations" | "enrollmentStatus"
  ) => {
    const newState = state.includes(value)
      ? state.filter((item) => item !== value)
      : [...state, value];

    onFilterChange({ ...selectedFilters, [key]: newState });
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-lg dark:bg-gray-dark dark:border-gray-700">
      <h3 className="text-xl font-bold text-black dark:text-white mb-6">Filter</h3>

      {/* Category Filter */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Category</h4>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleSelection(cat, selectedCategories, "categories")}
                className="w-4 h-4 text-[#4A6CF7] border-gray-300 rounded focus:ring-[#4A6CF7] dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="text-base text-body-color dark:text-body-color-dark">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Enrollment Status Filter */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Enrollment Status</h4>
        <div className="space-y-3">
          {enrollmentStatusOptions.map((statusValue) => (
            <label key={statusValue} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enrollmentStatus.includes(statusValue)}
                onChange={() => toggleSelection(statusValue, enrollmentStatus, "enrollmentStatus")}
                className="w-4 h-4 text-[#4A6CF7] border-gray-300 rounded focus:ring-[#4A6CF7] dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="text-base text-body-color dark:text-body-color-dark">
                {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Organization Filter */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Organization</h4>
        <div className="space-y-3">
          {organizations.map((org) => (
            <label key={org} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOrganizations.includes(org)}
                onChange={() => toggleSelection(org, selectedOrganizations, "organizations")}
                className="w-4 h-4 text-[#4A6CF7] border-gray-300 rounded focus:ring-[#4A6CF7] dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="text-base text-body-color dark:text-body-color-dark">{org}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
