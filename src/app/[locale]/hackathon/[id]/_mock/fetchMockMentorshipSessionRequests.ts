// src/app/[locale]/hackathon/[id]/_mock/fetchMockMentorshipSessionRequests.ts
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";

export const fetchMockMentorshipSessionRequests = (
  mentorTeamId: string
): Promise<MentorshipSessionRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMentorshipSessionRequests: MentorshipSessionRequest[] = [
        {
          id: "session1",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          location: "Room A",
          description: "Session on project architecture",
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "session2",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 7200000).toISOString(),
          location: "Room B",
          description: "Code review session",
          status: "APPROVED",
          evaluatedBy: {
            id: "admin789",
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice.johnson@example.com",
            username: "alicejohnson",
            avatarUrl: "https://example.com/alice-avatar.png",
            status: "Active",
            userRoles: [
              {
                id: "ur3",
                user: { id: "admin789" },
                role: { id: "1", name: "ADMIN" },
              },
            ],
          },
          evaluatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "session3",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 5400000).toISOString(),
          location: "Room C",
          description: "UI/UX design feedback",
          status: "REJECTED",
          evaluatedBy: {
            id: "admin101",
            firstName: "Chris",
            lastName: "Evans",
            email: "chris.evans@example.com",
            username: "chrisevans",
            avatarUrl: "https://example.com/chris-avatar.png",
            status: "Active",
            userRoles: [
              {
                id: "ur5",
                user: { id: "admin101" },
                role: { id: "1", name: "ADMIN" },
              },
            ],
          },
          evaluatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockMentorshipSessionRequests);
    }, 500);
  });
};
