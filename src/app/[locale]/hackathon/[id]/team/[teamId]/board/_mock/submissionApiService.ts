// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/submissionApiService.ts

import { Submission, SubmissionStatus } from "@/types/entities/submission";

interface SubmissionRequest {
  roundId: string;
  teamId: string;
  files: File[];
  status: SubmissionStatus;
}

export const createSubmission = async (
  data: SubmissionRequest
): Promise<Submission> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create mock file URLs from the selected files
      const mockFileUrls = data.files.map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file), // In a real app, this would be a server URL
        fileType: file.type,
        fileSize: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Mock user name - in a real app, get from authentication context
      const userName = "Current User";

      // Create a mock submission response
      const mockSubmission: Submission = {
        id: `submission-${Date.now()}`,
        round: {
          id: data.roundId,
        },
        roundId: data.roundId,
        team: {
          id: data.teamId,
        },
        teamId: data.teamId,
        fileUrls: mockFileUrls,
        judgeSubmissions: [], // New submissions won't have judge submissions yet
        status: "SUBMITTED",
        submittedAt: new Date().toISOString(),
        createdByUserName: userName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      resolve(mockSubmission);
    }, 1000); // Simulate network delay
  });
};

// Function to update an existing submission (for resubmission)
export const updateSubmission = async (
  submissionId: string,
  data: SubmissionRequest
): Promise<Submission> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create mock file URLs from the selected files
      const mockFileUrls = data.files.map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: file.type,
        fileSize: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Mock user name
      const userName = "Current User";

      // Create a mock updated submission response
      const mockSubmission: Submission = {
        id: submissionId,
        round: {
          id: data.roundId,
        },
        roundId: data.roundId,
        team: {
          id: data.teamId,
        },
        teamId: data.teamId,
        fileUrls: mockFileUrls,
        judgeSubmissions: [], // We'd typically keep existing judge submissions in a real app
        status: "SUBMITTED",
        submittedAt: new Date().toISOString(),
        createdByUserName: userName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      resolve(mockSubmission);
    }, 1000);
  });
};

// Function to fetch submissions for a team in a specific round
export const fetchSubmissionsForTeam = async (
  roundId: string,
  teamId: string
): Promise<Submission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // This would typically be a call to your backend API
      resolve([]);
    }, 500);
  });
};
