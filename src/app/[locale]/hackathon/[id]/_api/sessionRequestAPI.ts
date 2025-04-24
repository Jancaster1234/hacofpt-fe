// src/app/[locale]/hackathon/[id]/_api/sessionRequestAPI.ts
import {
  MentorshipSessionRequest,
  MentorshipSessionStatus,
} from "@/types/entities/mentorshipSessionRequest";

// Simulated API function to create a session request
export async function createSessionRequest(data: {
  mentorTeamId: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  status: MentorshipSessionStatus;
}): Promise<MentorshipSessionRequest> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate a random ID for the new session request
  const id = Math.random().toString(36).substring(2, 11);

  // Return a mock response
  const newSessionRequest: MentorshipSessionRequest = {
    id,
    mentorTeamId: data.mentorTeamId,
    startTime: data.startTime,
    endTime: data.endTime,
    location: data.location,
    description: data.description,
    status: data.status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log("Created session request:", newSessionRequest);
  return newSessionRequest;
}

// Simulated API function to update a session request
export async function updateSessionRequest(
  sessionId: string,
  data: {
    startTime?: string;
    endTime?: string;
    location?: string;
    description?: string;
    status?: MentorshipSessionStatus;
  }
): Promise<MentorshipSessionRequest> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Log the update operation
  console.log(`Updated session request ${sessionId} with data:`, data);

  // Return a mock updated session request
  return {
    id: sessionId,
    ...data,
    updatedAt: new Date().toISOString(),
  } as MentorshipSessionRequest;
}
