// src/app/[locale]/forum/_components/ForumCategoryItem.tsx
import Link from "next/link";
import { ForumCategory } from "@/types/entities/forumCategory";
import { useAuth } from "@/hooks/useAuth_v0";
import { useState } from "react";
import { forumCategoryService } from "@/services/forumCategory.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";

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
  const t = useTranslations("forum");
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.userRoles?.some(
    (userRole) => userRole.role.name === "ADMIN"
  );

  const handleDelete = async () => {
    if (confirm(t("confirmCategoryDelete"))) {
      setIsDeleting(true);
      try {
        const response = await forumCategoryService.deleteForumCategory(
          category.id
        );
        onDelete(category.id);
        toast.success(t("categoryDeleteSuccess"));
      } catch (error: any) {
        console.error("Failed to delete category:", error);
        toast.error(error.message || t("categoryDeleteFailed"));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between">
        <Link href={`/forum/category/${category.id}`} className="group flex-1">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 sm:mr-4">
              {/* Icon based on category name */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-400 rounded-lg flex items-center justify-center transition-colors duration-200">
                <span className="text-lg sm:text-xl">
                  {category.name.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors duration-200">
                {category.name}
              </h3>
              <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 sm:line-clamp-none">
                {category.description}
              </p>
            </div>
          </div>
        </Link>

        {isAdmin && (
          <div className="flex space-x-2 mt-3 sm:mt-0 sm:ml-4">
            <button
              onClick={() => onEdit(category)}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors duration-200"
              aria-label={t("editCategory")}
            >
              {t("edit")}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm  text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 border  border-red-300 dark:border-red-700 rounded dark:hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
              aria-label={t("deleteCategory")}
            >
              {isDeleting ? t("deleting") : t("delete")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
