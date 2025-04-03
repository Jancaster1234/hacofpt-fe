// src/services/teamRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { TeamRequest } from "@/types/entities/teamRequest";

type TeamRequestPayload = {
  hackathonId: string;
  name: string;
  note: string;
  teamRequestMembers: {
    userId: string;
  }[];
};

type TeamRequestReviewPayload = {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  note: string;
};

class TeamRequestService {
  async getTeamRequestsByHackathonAndUser(
    hackathonId: string,
    memberId: string
  ): Promise<Partial<TeamRequest>[]> {
    try {
      const response = await apiService.auth.get<Partial<TeamRequest>[]>(
        `/hackathon-service/api/v1/teams/requests?memberId=${memberId}&hackathonId=${hackathonId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching team requests by hackathonId and memberId:",
        error
      );
      throw error;
    }
  }

  async getTeamRequestsByUser(
    memberId: string
  ): Promise<Partial<TeamRequest>[]> {
    try {
      const response = await apiService.auth.get<Partial<TeamRequest>[]>(
        `/hackathon-service/api/v1/teams/requests?memberId=${memberId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching team requests by memberId:", error);
      throw error;
    }
  }

  async getTeamRequestsByHackathon(
    hackathonId: string
  ): Promise<Partial<TeamRequest>[]> {
    try {
      const response = await apiService.auth.get<Partial<TeamRequest>[]>(
        `/hackathon-service/api/v1/teams/requests?hackathonId=${hackathonId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching team requests by hackathonId:", error);
      throw error;
    }
  }

  async createTeamRequest(data: TeamRequestPayload): Promise<TeamRequest> {
    try {
      const response = await apiService.auth.post<TeamRequest>(
        "/hackathon-service/api/v1/teams/requests",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating TeamRequest:", error);
      throw error;
    }
  }

  async reviewTeamRequest(data: TeamRequestReviewPayload): Promise<TeamRequest> {
    try {
      const response = await apiService.auth.post<TeamRequest>(
        "/hackathon-service/api/v1/teams/requests/review",
        { data }
      );
      return response.data;
    } catch (error) {
      console.error("Error reviewing TeamRequest:", error);
      throw error;
    }
  }

  async deleteTeamRequest(id: string): Promise<void> {
    try {
      const response = await apiService.auth.delete<TeamRequest>(
        `/hackathon-service/api/v1/teams/requests/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to delete team request.");
      }

    } catch (error) {
      throw error;
    }
}

export const teamRequestService = new TeamRequestService();