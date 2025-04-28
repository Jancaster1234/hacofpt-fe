// src/app/[locale]/forum/_components/ForumCategoryForm.tsx
import { useState, useEffect } from "react";
import { ForumCategory } from "@/types/entities/forumCategory";
import { forumCategoryService } from "@/services/forumCategory.service";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ForumCategoryFormProps {
  category?: ForumCategory;
  onClose: () => void;
  onSuccess: () => void;
}

export const ForumCategoryForm = ({
  category,
  onClose,
  onSuccess,
}: ForumCategoryFormProps) => {
  const isEditing = Boolean(category?.id);
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    section: category?.section || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const t = useTranslations("forum");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let response;
      if (isEditing && category) {
        response = await forumCategoryService.updateForumCategory(
          category.id,
          formData
        );
        toast.success(response.message || t("categoryForm.updateSuccess"));
      } else {
        response = await forumCategoryService.createForumCategory(formData);
        toast.success(response.message || t("categoryForm.createSuccess"));
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || t("categoryForm.saveError");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-md shadow-xl transition-colors duration-300 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors">
          {isEditing
            ? t("categoryForm.editCategory")
            : t("categoryForm.addCategory")}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded transition-colors">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              {t("categoryForm.sectionName")}
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                        transition-colors"
              required
              aria-label={t("categoryForm.sectionName")}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              {t("categoryForm.categoryName")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                        transition-colors"
              required
              aria-label={t("categoryForm.categoryName")}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              {t("categoryForm.description")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                        min-h-24 transition-colors"
              aria-label={t("categoryForm.description")}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
                        rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label={t("common.cancel")}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded 
                        hover:bg-indigo-700 dark:hover:bg-indigo-600 
                        disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              aria-label={
                isSubmitting
                  ? t("common.saving")
                  : isEditing
                    ? t("common.update")
                    : t("common.create")
              }
            >
              {isSubmitting && <LoadingSpinner size="sm" />}
              {isSubmitting
                ? t("common.saving")
                : isEditing
                  ? t("common.update")
                  : t("common.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
