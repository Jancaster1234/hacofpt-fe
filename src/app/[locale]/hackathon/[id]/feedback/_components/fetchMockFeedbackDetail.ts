// src/app/[locale]/hackathon/[id]/feedback/_components/fetchMockFeedbackDetail.ts
import { FeedbackDetail } from "@/types/entities/feedbackDetail";

export const fetchMockFeedbackDetailByFeedbackId = (
  feedbackId: string
): Promise<FeedbackDetail[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockFeedbackDetails: FeedbackDetail[] = [
        {
          id: "detail1",
          feedbackId,
          content: "Great teamwork and collaboration.",
          maxRating: 10,
          rate: 9,
          note: "Keep up the good work!",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "detail2",
          feedbackId,
          content: "Innovative approach to problem-solving.",
          maxRating: 10,
          rate: 8,
          note: "Consider refining presentation skills.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "detail3",
          feedbackId,
          content: "Good time management and execution.",
          maxRating: 10,
          rate: 7,
          note: "Could improve on handling unexpected challenges.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockFeedbackDetails);
    }, 500);
  });
};
