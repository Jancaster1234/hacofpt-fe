// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockSubmissions.ts
import { Submission, SubmissionStatus } from "@/types/entities/submission";

export const fetchMockSubmissions = (
  roundId: string,
  createdByUserName: string
): Promise<Submission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSubmissions: Submission[] = [
        {
          id: "submission1",
          round: {
            id: roundId,
            roundTitle: "Idea Submission",
          },
          fileUrls: [
            {
              id: "file1",
              fileName: "proposal.pdf",
              fileUrl: "https://example.com/proposal.pdf",
              fileType: "pdf",
              fileSize: 204800,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          judgeSubmissions: [
            {
              id: "judgeSubmission1",
              judge: {
                id: "judge1",
                firstName: "User X",
                lastName: "User Y",
                email: "userx@example.com",
                avatarUrl: "https://example.com/avatars/userx.png",
                bio: "Experienced judge with a passion for innovation.",
                country: "USA",
                city: "New York",
                birthdate: "1985-06-12",
                phone: "+123456789",
                studentId: "JUDGE123",
                university: "Tech University",
                linkedinUrl: "https://linkedin.com/in/userx",
                githubUrl: "https://github.com/userx",
                skills: ["Product Management", "Design Thinking"],
                experienceLevel: "Beginner",
                status: "Active",
                userRoles: [
                  {
                    id: "ur1",
                    user: { id: "judge1" },
                    role: { id: "2", name: "JUDGE" },
                  },
                ],
              },
              score: 85,
              note: "Good idea execution",
              judgeSubmissionDetails: [
                {
                  id: "detail1",
                  score: 40,
                  note: "Great concept",
                  roundMarkCriterion: {
                    id: "criterion1",
                    name: "Creativity",
                    maxScore: 50,
                    note: "Measures innovation",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          status: "SUBMITTED",
          submittedAt: new Date().toISOString(),
          finalScore: 85,
          createdByUserName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "submission2",
          round: {
            id: roundId,
            roundTitle: "Idea Submission",
          },
          fileUrls: [
            {
              id: "file2",
              fileName: "prototype.mp4",
              fileUrl: "https://example.com/prototype.mp4",
              fileType: "mp4",
              fileSize: 10485760,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          judgeSubmissions: [],
          status: "DRAFT",
          submittedAt: "",
          createdByUserName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockSubmissions);
    }, 500);
  });
};
