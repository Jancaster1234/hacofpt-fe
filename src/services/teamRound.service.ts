// src/services/teamRound.service.ts
import { apiService } from "@/services/apiService_v0";
import { TeamRound } from "@/types/entities/teamRound";
import { TeamRoundStatus } from '@/types/entities/teamRound';

type TeamRoundPayload = {
  teamId?: string;
  roundId?: string;
  status?: TeamRoundStatus;
  description?: string;
}

class TeamRoundService {
  async getTeamRoundsByRoundId(roundId: string): Promise<Partial<TeamRound>[]> {
    try {
      const response = await apiService.auth.get<Partial<TeamRound>[]>(
        `/hackathon-service/api/v1/team-rounds?roundId=${roundId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching team rounds by roundId:", error);
      throw error;
    }
  }

  async getTeamRoundsByJudgeAndRound(judgeId: string, roundId: string): Promise<TeamRound[]> {
    try {
      const response = await apiService.auth.post<TeamRound[]>(
        "/api/v1/team-rounds/filter-by-judge-and-round",
        {
          data: {
            judgeId: judgeId,
            roundId: roundId
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching teamRounds by judgeId and roundId:", error);
      throw error;
    }
  }

  // Create a new team round
  async createTeamRound(data: TeamRoundPayload): Promise<TeamRound> {
    try {
      const response = await apiService.auth.post<TeamRound>(
        "/hackathon-service/api/v1/team-rounds",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating team round:", error);
      throw error;
    }
  }

  // Update an existing team round
  async updateTeamRound(id: string, data: TeamRoundPayload): Promise<TeamRound> {
    try {
      const response = await apiService.auth.put<TeamRound>(
        `/hackathon-service/api/v1/team-rounds/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating team round:", error);
      throw error;
    }
  }

  // Delete a team round
  async deleteTeamRound(id: string): Promise<void> {
    try {
      const response = await apiService.auth.delete<void>(
        `/hackathon-service/api/v1/team-rounds/${id}`
      );
      if (response.status !== 200) {
        throw new Error(`Failed to delete team round`);
      }
      console.log("Team round deleted successfully");
    } catch (error) {
      console.error("Error deleting team round:", error);
      throw error;
    }
  }
}

export const teamRoundService = new TeamRoundService();
