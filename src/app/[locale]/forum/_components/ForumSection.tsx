// src/app/[locale]/forum/_components/ForumSection.tsx
import { ForumCategory } from "@/types/entities/forumCategory";
import { ForumCategoryItem } from "./ForumCategoryItem";
import { useTranslations } from "@/hooks/useTranslations";

interface ForumSectionProps {
  sectionName: string;
  categories: ForumCategory[];
  onCategoryDelete: (id: string) => void;
  onCategoryEdit: (category: ForumCategory) => void;
}

export const ForumSection = ({
  sectionName,
  categories,
  onCategoryDelete,
  onCategoryEdit,
}: ForumSectionProps) => {
  const t = useTranslations("forum");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-200">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-indigo-600 dark:bg-indigo-700">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          {sectionName}
        </h2>
      </div>
      {categories.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {categories.map((category) => (
            <ForumCategoryItem
              key={category.id}
              category={category}
              onDelete={onCategoryDelete}
              onEdit={onCategoryEdit}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          {t("noCategoriesFound")}
        </div>
      )}
    </div>
  );
};
