// src/app/hackathon/[id]/team/[teamId]/board/_mock/fetchMockTeams.ts
import { Team } from "@/types/entities/team";

export const fetchMockTeams = (teamId?: string): Promise<Team[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeams: Team[] = [
        {
          id: "1",
          name: "Team Alpha",
          teamLeader: {
            id: "user123",
            firstName: "Alice",
            lastName: "Smith",
            email: "alice.smith@example.com",
            username: "alicesmith",
            avatarUrl: "https://example.com/alice-avatar.png",
            status: "Active",
            userRoles: [
              {
                id: "ur1",
                user: { id: "user123" },
                role: { id: "2", name: "TEAM_MEMBER" },
              },
            ],
          },
          teamMembers: [
            {
              id: "ut1",
              user: {
                id: "user123",
                firstName: "Alice",
                lastName: "Smith",
                email: "alice.smith@example.com",
                username: "alicesmith",
                avatarUrl: "https://example.com/alice-avatar.png",
                status: "Active",
                userRoles: [
                  {
                    id: "ur1",
                    user: { id: "user123" },
                    role: { id: "2", name: "TEAM_MEMBER" },
                  },
                ],
              },
            },
            {
              id: "ut2",
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
            },
          ],
          isDeleted: false,
          bio: "an awesome team",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTeams);
    }, 500);
  });
};
