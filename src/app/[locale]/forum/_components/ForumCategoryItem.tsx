// src/app/[locale]/forum/_components/ForumCategoryItem.tsx
import Link from "next/link";
import { ForumCategory } from "@/types/entities/forumCategory";
import { useAuth } from "@/hooks/useAuth_v0";
import { useState } from "react";
import { forumCategoryService } from "@/services/forumCategory.service";

interface ForumCategoryItemProps {
  category: ForumCategory;
  onDelete: (id: string) => void;
  onEdit: (category: ForumCategory) => void;
}

export const ForumCategoryItem = ({
  category,
  onDelete,
  onEdit,
}: ForumCategoryItemProps) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.userRoles?.some(
    (userRole) => userRole.role.name === "ADMIN"
  );

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this category?")) {
      setIsDeleting(true);
      try {
        await forumCategoryService.deleteForumCategory(category.id);
        onDelete(category.id);
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete the category");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition duration-150">
      <div className="flex items-start justify-between">
        <Link href={`/forum/category/${category.id}`} className="group flex-1">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              {/* Icon based on category name */}
              <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">{category.name.charAt(0)}</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-600 group-hover:text-indigo-800 transition duration-150">
                {category.name}
              </h3>
              <p className="mt-1 text-gray-600">{category.description}</p>
            </div>
          </div>
        </Link>

        {isAdmin && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(category)}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-300 rounded hover:bg-indigo-50"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
