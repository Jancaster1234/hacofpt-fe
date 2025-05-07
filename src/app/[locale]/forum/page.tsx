// src/app/[locale]/forum/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ForumCategory } from "@/types/entities/forumCategory";
import { forumCategoryService } from "@/services/forumCategory.service";
import { ForumSection } from "./_components/ForumSection";
import { ForumCategoryForm } from "./_components/ForumCategoryForm";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

export default function ForumPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ForumCategory | undefined
  >(undefined);

  const { user } = useAuth();
  const t = useTranslations("forum");
  const toast = useToast();

  const isAdmin = user?.userRoles?.some(
    (userRole) => userRole.role.name === "ADMIN"
  );

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await forumCategoryService.getAllForumCategories();
      setCategories(response.data);
    } catch (err: any) {
      setError(err.message || t("failedToLoadCategories"));
    } finally {
      setIsLoading(false);
    }
  };

  // Group categories by section
  const sections = categories.reduce(
    (acc, category) => {
      if (!acc[category.section]) {
        acc[category.section] = [];
      }
      acc[category.section].push(category);
      return acc;
    },
    {} as Record<string, ForumCategory[]>
  );

  const handleAddCategory = () => {
    setSelectedCategory(undefined);
    setShowForm(true);
  };

  const handleEditCategory = (category: ForumCategory) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (id: string) => {
    // Just remove the category from the state to update the UI
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleFormSuccess = () => {
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 transition-colors duration-300">
            {t("communityForum")}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            {t("forumDescription")}
          </p>

          {isAdmin && (
            <div className="mt-4 sm:mt-6">
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                {t("addNewCategory")}
              </button>
            </div>
          )}
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-6 sm:py-10">
            <LoadingSpinner size="md" showText={true} />
            <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {t("loadingCategories")}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 transition-colors duration-300">
            <p>{error}</p>
            <button
              onClick={fetchCategories}
              className="mt-2 text-sm underline hover:text-red-800 dark:hover:text-red-200 transition-colors duration-200"
            >
              {t("tryAgain")}
            </button>
          </div>
        )}

        {/* Forum Sections */}
        {!isLoading && !error && (
          <div className="space-y-6 sm:space-y-8">
            {Object.entries(sections).length > 0 ? (
              Object.entries(sections).map(
                ([sectionName, sectionCategories]) => (
                  <ForumSection
                    key={sectionName}
                    sectionName={sectionName}
                    categories={sectionCategories}
                    onCategoryDelete={handleDeleteCategory}
                    onCategoryEdit={handleEditCategory}
                  />
                )
              )
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 text-center transition-colors duration-300">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("noCategories")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
              {t("forumGuidelines")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
              {t("guidelinesDescription")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
              {t("recentActivity")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
              {t("activityDescription")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md hidden sm:block lg:col-span-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
              {t("needHelp")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
              {t("helpDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Forum Category Form Modal */}
      {showForm && (
        <ForumCategoryForm
          category={selectedCategory}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
