// src/app/[locale]/forum/thread/[id]/_mock/fetchMockThreadPostReports.ts
import { ThreadPostReport } from "@/types/entities/threadPostReport";

export const fetchMockThreadPostReports = (
  threadPostId: string
): Promise<ThreadPostReport[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockThreadPostReports: ThreadPostReport[] = [
        {
          id: "report1",
          threadPostId: threadPostId,
          reason: "Inappropriate content",
          status: "PENDING",
          createdAt: new Date().toISOString(),
          createdByUserName: "Alice Smith",
        },
        {
          id: "report2",
          threadPostId: threadPostId,
          reason: "Spam",
          status: "REVIEWED",
          createdAt: new Date().toISOString(),
          createdByUserName: "Bob Johnson",
          reviewedById: "admin1",
        },
      ];
      resolve(mockThreadPostReports);
    }, 500);
  });
};
