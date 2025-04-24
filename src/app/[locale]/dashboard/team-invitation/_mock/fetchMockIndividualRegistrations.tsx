// src/app/[locale]/dashboard/team-invitation/_mock/fetchMockIndividualRegistrations.tsx
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";

export const fetchMockIndividualRegistrations = (
  createdByUserName: string
): Promise<IndividualRegistrationRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockIndividualRegistrations: IndividualRegistrationRequest[] = [
        {
          id: "reg1",
          hackathon: {
            id: "hackathonId134",
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
          status: "PENDING",
          reviewedBy: undefined,
          createdByUserName: createdByUserName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg2",
          hackathon: {
            id: "hackathonId134234",
            title: "Hackathon Alpha",
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
