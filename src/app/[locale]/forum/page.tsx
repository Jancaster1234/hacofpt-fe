// src/app/[locale]/forum/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ForumCategory } from "@/types/entities/forumCategory";
import { forumCategoryService } from "@/services/forumCategory.service";
import { ForumSection } from "./_components/ForumSection";
import { ForumCategoryForm } from "./_components/ForumCategoryForm";
import { useAuth } from "@/hooks/useAuth_v0";

export default function ForumPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ForumCategory | undefined
  >(undefined);

  const { user } = useAuth();
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
      setError(err.message || "Failed to load forum categories");
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

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleFormSuccess = () => {
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Forum
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join discussions, share ideas, and connect with other community
            members
          </p>

          {isAdmin && (
            <div className="mt-6">
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Add New Category
              </button>
            </div>
          )}
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading forum categories...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            <p>{error}</p>
            <button
              onClick={fetchCategories}
              className="mt-2 text-sm underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Forum Sections */}
        {!isLoading && !error && (
          <div className="space-y-8">
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
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-500">No forum categories found.</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Forum Guidelines</h3>
            <p className="text-gray-600 text-sm">
              Make sure to read our community guidelines before posting.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-gray-600 text-sm">
              Check out the latest discussions and updates.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm">
              Contact our support team if you need assistance.
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
