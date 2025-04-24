// src/app/[locale]/hackathon/[id]/_api/mentorshipRequestAPI.ts
import {
  MentorshipRequest,
  MentorshipStatus,
} from "@/types/entities/mentorshipRequest";

// Simulated API function to create a mentorship request
export async function createMentorshipRequest(data: {
  hackathonId: string;
  mentorId: string;
  teamId: string;
  status: MentorshipStatus;
}): Promise<MentorshipRequest> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate a random ID for the new request
  const id = Math.random().toString(36).substring(2, 11);

  // Return a mock response
  const newRequest: MentorshipRequest = {
    id,
    hackathonId: data.hackathonId,
    mentorId: data.mentorId,
    teamId: data.teamId,
    status: data.status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log("Created mentorship request:", newRequest);
  return newRequest;
}

// Simulated API function to update a mentorship request
export async function updateMentorshipRequest(
  requestId: string,
  data: Partial<MentorshipRequest>
): Promise<MentorshipRequest> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Log the update operation
  console.log(`Updated mentorship request ${requestId} with data:`, data);

  // Return a mock updated request
  return {
    id: requestId,
    ...data,
    updatedAt: new Date().toISOString(),
  } as MentorshipRequest;
}

// Simulated API function to delete a mentorship request
// This actually calls updateMentorshipRequest to change status to DELETED
export async function deleteMentorshipRequest(
  requestId: string
): Promise<void> {
  await updateMentorshipRequest(requestId, { status: "DELETED" });
  console.log(`Deleted mentorship request ${requestId}`);
}
