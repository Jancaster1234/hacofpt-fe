// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockHackathonResults.ts
import { HackathonResult } from "@/types/entities/hackathonResult";

export const fetchMockHackathonResults = (
  hackathonId: string
): Promise<HackathonResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResults: HackathonResult[] = [
        {
          id: "result1",
          team: {
            id: "team1",
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
                  role: { id: "5", name: "MENTOR" },
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
            teamHackathons: [
              {
                id: "th1",
                team: undefined,
                hackathon: { id: hackathonId, title: "Hackathon X" },
                status: "Active",
              },
            ],
            isDeleted: false,
            bio: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          totalScore: 95,
          placement: 1,
          award: "First Place",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "result2",
          team: {
            id: "team2",
            name: "Team Beta",
            teamLeader: {
              id: "user789",
              firstName: "Charlie",
              lastName: "Brown",
              email: "charlie.brown@example.com",
              username: "charliebrown",
              avatarUrl: "https://example.com/charlie-avatar.png",
              status: "Active",
              userRoles: [
                {
                  id: "ur3",
                  user: { id: "user789" },
                  role: { id: "2", name: "TEAM_MEMBER" },
                },
              ],
            },
            teamMembers: [
              {
                id: "ut3",
                user: {
                  id: "user789",
                  firstName: "Charlie",
                  lastName: "Brown",
                  email: "charlie.brown@example.com",
                  username: "charliebrown",
                  avatarUrl: "https://example.com/charlie-avatar.png",
                  status: "Active",
                  userRoles: [
                    {
                      id: "ur3",
                      user: { id: "user789" },
                      role: { id: "2", name: "TEAM_MEMBER" },
                    },
                  ],
                },
              },
              {
                id: "ut4",
                user: {
                  id: "user567",
                  firstName: "Eve",
                  lastName: "Adams",
                  email: "eve.adams@example.com",
                  username: "eveadams",
                  avatarUrl: "https://example.com/eve-avatar.png",
                  status: "Active",
                  userRoles: [
                    {
                      id: "ur4",
                      user: { id: "user567" },
                      role: { id: "2", name: "TEAM_MEMBER" },
                    },
                  ],
                },
              },
            ],
            teamHackathons: [
              {
                id: "th2",
                team: undefined,
                hackathon: { id: hackathonId, title: "Hackathon X" },
                status: "Active",
              },
            ],
            isDeleted: false,
            bio: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          totalScore: 85,
          placement: 2,
          award: "Second Place",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "result3",
          team: {
            id: "team3",
            name: "Team Gamma",
            teamLeader: {
              id: "user999",
              firstName: "Dave",
              lastName: "Miller",
              email: "dave.miller@example.com",
              username: "davemiller",
              avatarUrl: "https://example.com/dave-avatar.png",
              status: "Active",
              userRoles: [
                {
                  id: "ur5",
                  user: { id: "user999" },
                  role: { id: "2", name: "TEAM_MEMBER" },
                },
              ],
            },
            teamMembers: [
              {
                id: "ut5",
                user: {
                  id: "user999",
                  firstName: "Dave",
                  lastName: "Miller",
                  email: "dave.miller@example.com",
                  username: "davemiller",
                  avatarUrl: "https://example.com/dave-avatar.png",
                  status: "Active",
                  userRoles: [
                    {
                      id: "ur5",
                      user: { id: "user999" },
                      role: { id: "2", name: "TEAM_MEMBER" },
                    },
                  ],
                },
                team: undefined,
              },
              {
                id: "ut6",
                user: {
                  id: "user777",
                  firstName: "Olivia",
                  lastName: "Taylor",
                  email: "olivia.taylor@example.com",
                  username: "oliviataylor",
                  avatarUrl: "https://example.com/olivia-avatar.png",
                  status: "Active",
                  userRoles: [
                    {
                      id: "ur6",
                      user: { id: "user777" },
                      role: { id: "2", name: "TEAM_MEMBER" },
                    },
                  ],
                },
                team: undefined,
              },
            ],
            teamHackathons: [
              {
                id: "th3",
                team: undefined,
                hackathon: { id: hackathonId, title: "Hackathon X" },
                status: "Active",
              },
            ],
            isDeleted: false,
            bio: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          totalScore: 78,
          placement: 3,
          award: "Third Place",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockResults);
    }, 500);
  });
};
