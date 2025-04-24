// src/app/[locale]/hackathon/[id]/_mock/fetchMockTeamRequests.ts
import { TeamRequest } from "@/types/entities/teamRequest";

export const fetchMockTeamRequests = (
  userId: string,
  hackathonId: string
): Promise<TeamRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRequests: TeamRequest[] = [
        {
          id: "request1",
          status: "PENDING",
          confirmationDeadline: new Date().toISOString(),
          note: "Looking for team members",
          teamRequestMembers: [
            {
              id: "trm1",
              user: {
                id: userId,
                firstName: "Your",
                lastName: "Name",
                email: "yourname@example.com",
                username: "yourname",
                avatarUrl: "https://example.com/your-avatar.png",
                status: "Active",
                userRoles: [
                  {
                    id: "ur1",
                    user: { id: userId },
                    role: { id: "2", name: "TEAM_MEMBER" },
                  },
                ],
              },
              status: "pending",
              respondedAt: "",
            },
            {
              id: "trm2",
              user: {
                id: "user456",
                firstName: "Bob",
                lastName: "Johnson",
                email: "bob.johnson@example.com",
                username: "bobjohnson",
                avatarUrl: "https://example.com/bob-avatar.png",
                status: "Active",
                userRoles: [
                  {
                    id: "ur2",
                    user: { id: "user456" },
                    role: { id: "2", name: "TEAM_MEMBER" },
                  },
                ],
              },
              status: "approved",
              respondedAt: new Date().toISOString(),
            },
          ],
          createdByUserName: "alice_smith",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "request2",
          status: "UNDER_REVIEW",
          confirmationDeadline: new Date().toISOString(),
          note: "Need a designer",
          teamRequestMembers: [
            {
              id: "trm3",
              user: {
                id: userId,
                firstName: "Your",
                lastName: "Name",
                email: "yourname@example.com",
                username: "yourname",
                avatarUrl: "https://example.com/your-avatar.png",
                status: "Active",
                userRoles: [
                  {
                    id: "ur3",
                    user: { id: userId },
                    role: { id: "2", name: "TEAM_MEMBER" },
                  },
                ],
              },
              status: "pending",
              respondedAt: "",
            },
          ],
          createdByUserName: "alice_smith",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTeamRequests);
    }, 500);
  });
};
