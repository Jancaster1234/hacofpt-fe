// src/app/[locale]/hackathon/[id]/_mock/fetchMockMentorshipRequests.ts
import {
  MentorshipRequest,
  MentorshipStatus,
} from "@/types/entities/mentorshipRequest";

export const fetchMockMentorshipRequests = (
  teamId: string,
  hackathonId: string
): Promise<MentorshipRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMentorshipRequests: MentorshipRequest[] = [
        {
          id: "mentorshipReq1",
          mentor: {
            id: "mentor123",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            username: "johndoe",
            avatarUrl: "https://example.com/john-avatar.png",
            linkedinUrl: "https://linkedin.com/in/johndoe",
            githubUrl: "https://github.com/johndoe",
            skills: ["JavaScript", "React", "Node.js"],
            experienceLevel: "Advanced",
            status: "Active",
            userRoles: [
              {
                id: "ur1",
                user: { id: "mentor123" },
                role: { id: "5", name: "MENTOR" },
              },
            ],
          },
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mentorshipReq2",
          mentor: {
            id: "mentor456",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            username: "janesmith",
            avatarUrl: "https://example.com/jane-avatar.png",
            linkedinUrl: "https://linkedin.com/in/janesmith",
            githubUrl: "https://github.com/janesmith",
            skills: ["Python", "Machine Learning"],
            experienceLevel: "Intermediate",
            status: "Active",
            userRoles: [
              {
                id: "ur2",
                user: { id: "mentor456" },
                role: { id: "5", name: "MENTOR" },
              },
            ],
          },
          status: "APPROVED",
          evaluatedAt: new Date().toISOString(),
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mentorshipReq3",
          mentor: {
            id: "mentor789",
            firstName: "Michael",
            lastName: "Brown",
            email: "michael.brown@example.com",
            username: "michaelbrown",
            avatarUrl: "https://example.com/michael-avatar.png",
            linkedinUrl: "https://linkedin.com/in/michaelbrown",
            githubUrl: "https://github.com/michaelbrown",
            skills: ["Java", "Spring Boot"],
            experienceLevel: "Advanced",
            status: "Active",
            userRoles: [
              {
                id: "ur4",
                user: { id: "mentor789" },
                role: { id: "5", name: "MENTOR" },
              },
            ],
          },
          status: "REJECTED",
          evaluatedAt: new Date().toISOString(),
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockMentorshipRequests);
    }, 500);
  });
};
