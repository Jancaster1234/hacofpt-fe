// src/app/[locale]/forum/thread/[id]/_mock/fetchMockThreadPosts.ts
import { ThreadPost } from "@/types/entities/threadPost";

export const fetchMockThreadPosts = (
  forumThreadId: string
): Promise<ThreadPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockThreadPosts: ThreadPost[] = [
        {
          id: "post1",
          forumThreadId: forumThreadId,
          content: "I love using Next.js for SSR and static generation!",
          isDeleted: false,
          deletedBy: undefined,
          createdAt: new Date().toISOString(),
          createdByUserName: "Bob Johnson",
        },
        {
          id: "post2",
          forumThreadId: forumThreadId,
          content: "TypeScript makes it even better!",
          isDeleted: false,
          deletedById: undefined,
          createdAt: new Date().toISOString(),
          createdByUserName: "Bob Johnson",
        },
        {
          id: "post3",
          forumThreadId: forumThreadId,
          content: "Tailwind CSS integration is smooth and powerful.",
          isDeleted: true,
          deletedById: "user123",
          createdAt: new Date().toISOString(),
          createdByUserName: "Bob Johnson",
        },
      ];
      resolve(mockThreadPosts);
    }, 500);
  });
};
