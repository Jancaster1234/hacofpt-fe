// src/app/[locale]/hackathon/[id]/_mock/fetchMockIndividualRegistrations.ts
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";

export const fetchMockIndividualRegistrations = (
  createdByUserName: string,
  hackathonId: string
): Promise<IndividualRegistrationRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockIndividualRegistrations: IndividualRegistrationRequest[] = [
        {
          id: "reg1",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          status: "PENDING",
          reviewedBy: undefined,
          createdByUserName: createdByUserName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg2",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          status: "APPROVED",
          reviewedBy: {
            id: "adminUser",
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            username: "adminUser",
            avatarUrl: "https://example.com/avatar.png",
            bio: "Experienced hackathon judge",
            country: "USA",
            city: "New York",
            linkedinUrl: "https://linkedin.com/in/adminUser",
            githubUrl: "https://github.com/adminUser",
            skills: ["Leadership", "Mentorship"],
            experienceLevel: "Advanced",
            status: "Active",
            userRoles: [
              {
                id: "ur3",
                role: { id: "5", name: "ADMIN" },
              },
            ],
          },
          createdByUserName: createdByUserName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockIndividualRegistrations);
    }, 500);
  });
};
