// src/services/mentorshipRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";

type MentorshipRequestPayload = {
  id?: string;
  hackathonId: string;
  mentorId: string;
  teamId?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
  evaluatedById?: string;
};

class MentorshipRequestService {
  async createMentorshipRequest(
    data: MentorshipRequestPayload
  ): Promise<MentorshipRequest> {
    try {
      const response = await apiService.auth.post<MentorshipRequest>(
        "hackathon-service/api/v1/mentors/request",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Mentorship Request:", error);
      throw error;
    }
  }

  async updateMentorshipRequest(
    data: MentorshipRequestPayload
  ): Promise<MentorshipRequest> {
    try {
      const response = await apiService.auth.put<MentorshipRequest>(
        "hackathon-service/api/v1/mentors/request",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Mentorship Request:", error);
      throw error;
    }
  }
}

export const mentorshipRequestService = new MentorshipRequestService();
