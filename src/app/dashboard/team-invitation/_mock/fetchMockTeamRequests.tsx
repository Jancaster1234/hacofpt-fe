// src/app/dashboard/team-invitation/_mock/fetchMockTeamRequests.tsx
import { TeamRequest } from "@/types/entities/teamRequest";

export const fetchMockTeamRequests = (
  userId: string
): Promise<TeamRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRequests: TeamRequest[] = [
        {
          id: "tr1",
          hackathon: {
            id: "hack1",
            title: "Hackathon Alpha",
            subtitle: "An exciting challenge for coders",
            bannerImageUrl: "https://example.com/banner1.jpg",
            enrollStartDate: new Date().toISOString(),
            enrollEndDate: new Date().toISOString(),
            enrollmentCount: 120,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            information: "All details about Hackathon Alpha.",
            description: "Join us for an intense coding competition.",
          },
          status: "PENDING",
          confirmationDeadline: new Date().toISOString(),
          note: "Looking for teammates!",
          reviewedBy: undefined,
          teamRequestMembers: [
            {
              id: "trm1",
              user: {
                id: userId,
                firstName: "Your",
                lastName: "Name",
                email: "your.email@example.com",
                username: "your_username",
                avatarUrl: "https://example.com/avatar1.png",
                bio: "Aspiring developer looking for team members.",
                country: "USA",
                city: "New York",
                linkedinUrl: "https://linkedin.com/in/yourprofile",
                githubUrl: "https://github.com/yourprofile",
                skills: ["JavaScript", "React", "Node.js"],
                experienceLevel: "Intermediate",
                status: "Active",
              },
              status: "pending",
              respondedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "trm2",
              user: {
                id: "user456",
                firstName: "Bob",
                lastName: "Johnson",
                email: "bob.johnson@example.com",
                username: "bobj",
                avatarUrl: "https://example.com/avatar2.png",
                bio: "Frontend developer passionate about UI/UX.",
                country: "Canada",
                city: "Toronto",
                linkedinUrl: "https://linkedin.com/in/bobjohnson",
                githubUrl: "https://github.com/bobjohnson",
                skills: ["HTML", "CSS", "Vue.js"],
                experienceLevel: "Advanced",
                status: "Active",
              },
              status: "no_response",
              respondedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdByUserName: "alice_smith",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "tr2",
          hackathon: {
            id: "hack2",
            title: "Hackathon Beta",
            subtitle: "A blockchain and security hackathon",
            bannerImageUrl: "https://example.com/banner2.jpg",
            enrollStartDate: new Date().toISOString(),
            enrollEndDate: new Date().toISOString(),
            enrollmentCount: 85,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            information: "All details about Hackathon Beta.",
            description: "Explore the future of blockchain security.",
          },
          status: "UNDER_REVIEW",
          confirmationDeadline: new Date().toISOString(),
          note: "Team is reviewing applications.",
          reviewedBy: {
            id: "admin1",
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            username: "admin_user",
            avatarUrl: "https://example.com/admin.png",
            bio: "Admin overseeing hackathon applications.",
            country: "USA",
            city: "San Francisco",
            linkedinUrl: "https://linkedin.com/in/adminuser",
            githubUrl: "https://github.com/adminuser",
            skills: ["Management", "Event Planning"],
            experienceLevel: "Advanced",
            status: "Active",
          },
          teamRequestMembers: [
            {
              id: "trm3",
              user: {
                id: userId,
                firstName: "Bob",
                lastName: "Johnson",
                email: "bob.johnson@example.com",
                username: "bobj",
                avatarUrl: "https://example.com/avatar2.png",
                bio: "Frontend developer passionate about UI/UX.",
                country: "Canada",
                city: "Toronto",
                linkedinUrl: "https://linkedin.com/in/bobjohnson",
                githubUrl: "https://github.com/bobjohnson",
                skills: ["HTML", "CSS", "Vue.js"],
                experienceLevel: "Advanced",
                status: "Active",
              },
              status: "approved",
              respondedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdByUserName: "charlieb",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockTeamRequests);
    }, 500);
  });
};
