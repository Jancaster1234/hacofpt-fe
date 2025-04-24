// src/app/[locale]/forum/category/[id]/mocks/fetchMockThreads.ts
import { ForumThread } from "@/types/entities/forumThread";
import { mockForumThreads } from "@/mocks/forumThread.mock";

/**
 * Simulates fetching threads for a specific forum category.
 * @param categoryId The ID of the forum category.
 * @returns A promise resolving to a list of forum threads.
 */
export const fetchMockThreads = (
  categoryId: string
): Promise<ForumThread[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockForumThreads);
    }, 500); // Simulated API delay
  });
};
