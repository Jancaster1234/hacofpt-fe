// src/app/[locale]/hackathon/[id]/feedback/_components/fetchMockFeedbackByHackathonId.ts
import { Feedback } from "@/types/entities/feedback";
export const fetchMockFeedbackByHackathonId = (
  hackathonId: string
): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockFeedback: Feedback[] = [
        {
          id: "feedback4",
          createdByUserName: "mentorUser1",
          hackathonId,
          mentorId: "mentor4",
          teamId: "team4",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "feedback5",
          createdByUserName: "mentorUser2",
          hackathonId,
          mentorId: "mentor5",
          teamId: "team5",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "feedback6",
          createdByUserName: "mentorUser3",
          hackathonId,
          mentorId: "mentor6",
          teamId: "team6",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockFeedback);
    }, 500);
  });
};
