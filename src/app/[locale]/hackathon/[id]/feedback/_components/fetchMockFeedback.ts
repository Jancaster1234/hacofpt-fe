// src/app/[locale]/hackathon/[id]/feedback/_components/fetchMockFeedback.ts
import { Feedback } from "@/types/entities/feedback";

export const fetchMockFeedbackByCreatedUser = (
  createdByUserName: string
): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockFeedback: Feedback[] = [
        {
          id: "feedback1",
          createdByUserName,
          hackathonId: "hackathon1",
          mentorId: "mentor1",
          teamId: "team1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "feedback2",
          createdByUserName,
          hackathonId: "hackathon2",
          mentorId: "mentor2",
          teamId: "team2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "feedback3",
          createdByUserName,
          hackathonId: "hackathon3",
          mentorId: "mentor3",
          teamId: "team3",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockFeedback);
    }, 500);
  });
};
