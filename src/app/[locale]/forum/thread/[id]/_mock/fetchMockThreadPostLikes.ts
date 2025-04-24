// src/app/[locale]/forum/thread/[id]/_mock/fetchMockThreadPostLikes.ts
import { ThreadPostLike } from "@/types/entities/threadPostLike";

export const fetchMockThreadPostLikes = (
  threadPostId: string
): Promise<ThreadPostLike[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockThreadPostLikes: ThreadPostLike[] = [
        {
          id: "like1",
          threadPostId: threadPostId,
          createdAt: new Date().toISOString(),
          createdByUserName: "Alice Smith",
        },
        {
          id: "like2",
          threadPostId: threadPostId,
          createdAt: new Date().toISOString(),
          createdByUserName: "Poppy Johnson",
        },
      ];
      resolve(mockThreadPostLikes);
    }, 500);
  });
};
