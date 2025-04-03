// src/services/mentorshipSessionRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";

type MentorshipSessionRequestPayload = {
  id? : string,
  mentorTeamId: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
  evaluatedById?: string;
  evaluatedAt?: string;
};

class MentorshipSessionRequestService {
  async createMentorshipSessionRequest(
    data: MentorshipSessionRequestPayload
  ): Promise<MentorshipSessionRequest> {
    try {
      const response = await apiService.auth.post<MentorshipSessionRequest>(
        "/hackathon-service/api/v1/mentors/sessions",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Mentorship Session Request:", error);
      throw error;
    }
  }

  async updateMentorshipSessionRequest(
    data: MentorshipSessionRequestPayload
  ): Promise<MentorshipSessionRequest> {
    try {
      const response = await apiService.auth.put<MentorshipSessionRequest>(
        `/hackathon-service/api/v1/mentorship/sessions`,
        data 
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Mentorship Session Request:", error);
      throw error;
    }
  }

  async getMentorshipSessionRequestsByMentorTeamId(mentorTeamId: string): Promise<MentorshipSessionRequest[]> {
    try {
      const response = await apiService.auth.get<MentorshipSessionRequest[]>(
        `/hackathon-service/api/v1/mentorship/sessions/filter-by-mentor-team?mentorTeamId=${mentorTeamId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching mentorship session requests by mentorTeamId:", error);
      throw error;
    }
  }

  async deleteMentorshipRequestSession(id: string): Promise<MentorshipSessionRequest> {
    try {
      const requestData = {
        data: id,
      };

      const response = await fetch("/hackathon-service/api/v1/mentorship/sessions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete mentorship session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting mentorship session:", error);
      throw error;
    }
  }
}

export const mentorshipSessionRequestService =
  new MentorshipSessionRequestService();
