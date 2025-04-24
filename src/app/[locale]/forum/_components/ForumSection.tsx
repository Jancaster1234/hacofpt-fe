// src/app/[locale]/forum/_components/ForumSection.tsx
import { ForumCategory } from "@/types/entities/forumCategory";
import { ForumCategoryItem } from "./ForumCategoryItem";

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
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-indigo-600">
        <h2 className="text-xl font-semibold text-white">{sectionName}</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {categories.map((category) => (
          <ForumCategoryItem
            key={category.id}
            category={category}
            onDelete={onCategoryDelete}
            onEdit={onCategoryEdit}
          />
        ))}
      </div>
    </div>
  );
};
