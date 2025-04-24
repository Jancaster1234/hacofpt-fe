// src/app/[locale]/hackathon/[id]/_mock/fetchMockMentors.ts
import { User, UserRole, UserStatus } from "@/types/entities/user";

export const fetchMockMentors = (hackathonId: string): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMentors: User[] = [
        {
          id: "mentor1",
          email: "alice@example.com",
          username: "alice123",
          firstName: "Alice",
          lastName: "Johnson",
          avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg",
          bio: "Software engineer passionate about hackathons.",
          country: "USA",
          city: "San Francisco",
          birthdate: "1995-06-15",
          phone: "+1234567890",
          studentId: "S12345",
          university: "MIT",
          linkedinUrl: "https://linkedin.com/in/alicejohnson",
          githubUrl: "https://github.com/alicejohnson",
          skills: ["React", "Node.js", "GraphQL"],
          experienceLevel: "Advanced",
          status: "Active",
          userRoles: [
            {
              id: "ur3",
              user: {
                id: "mentor1",
              },
              role: { id: "5", name: "MENTOR" },
            },
          ],
          mentorTeams: [],
          mentorTeamLimits: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mentor2",
          email: "bob@example.com",
          username: "bobdev",
          firstName: "Bob",
          lastName: "Smith",
          avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg",
          bio: "Full-stack developer and hackathon enthusiast.",
          country: "USA",
          city: "New York",
          birthdate: "1992-08-21",
          phone: "+1987654321",
          studentId: "S67890",
          university: "Stanford",
          linkedinUrl: "https://linkedin.com/in/bobsmith",
          githubUrl: "https://github.com/bobsmith",
          skills: ["Vue.js", "Django", "SQL"],
          experienceLevel: "Intermediate",
          status: "Active",
          userRoles: [
            {
              id: "ur4",
              user: {
                id: "mentor2",
              },
              role: { id: "5", name: "MENTOR" },
            },
          ],
          mentorTeams: [],
          mentorTeamLimits: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockMentors);
    }, 500);
  });
};
