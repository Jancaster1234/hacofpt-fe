// src/app/forum/page.tsx
import { ForumCategory } from "@/types/entities/forumCategory";
import Link from "next/link";

const categories: ForumCategory[] = [
  {
    id: "1",
    name: "Hackathon Announcements",
    description: "Official updates from organizers and judges.",
  },
  {
    id: "2",
    name: "Team Formation",
    description: "Find teammates to participate in a hackathon.",
  },
];

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
        Forum
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-4 shadow rounded-lg">
            <Link href={`/forum/category/${category.id}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                {category.name}
              </h2>
            </Link>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
