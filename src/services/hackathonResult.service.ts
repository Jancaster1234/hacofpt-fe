// src/services/hackathonResult.service.ts
import { apiService } from "@/services/apiService_v0";
import { HackathonResult } from "@/types/entities/hackathonResult";

type HackathonResultPayload = {
  id?: string;
  hackathonId: string;
  teamId: string;
  totalScore: number;
  placement: number;
  award?: string;
};

class HackathonResultService {
  async getHackathonResultsByHackathonId(
    hackathonId: string
  ): Promise<HackathonResult[]> {
    try {
      const response = await apiService.auth.get<HackathonResult[]>(
        `/hackathon-service/api/v1/hackathons/results/${hackathonId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching hackathon results by hackathonId:", error);
      throw error;
    }
  }

  async createHackathonResult(
    data: HackathonResultPayload
  ): Promise<HackathonResult> {
    try {
      const response = await apiService.auth.post<HackathonResult>(
        "/hackathon-service/api/v1/hackathons/results",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating HackathonResult:", error);
      throw error;
    }
  }

  async updateHackathonResult(
    data: HackathonResultPayload
  ): Promise<HackathonResult> {
    try {
      const response = await apiService.auth.put<HackathonResult>(
        "/hackathon-service/api/v1/hackathons/results",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating HackathonResult:", error);
      throw error;
    }
  }

  async createBulkHackathonResults(
    data: HackathonResultPayload[]
  ): Promise<HackathonResult[]> {
    try {
      const response = await apiService.auth.post<HackathonResult[]>(
        "/hackathon-service/api/v1/hackathons/results/bulk-create",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating bulk HackathonResults:", error);
      throw error;
    }
  }

  async updateBulkHackathonResults(
    data: HackathonResultPayload[]
  ): Promise<HackathonResult[]> {
    try {
      const response = await apiService.auth.put<HackathonResult[]>(
        "/hackathon-service/api/v1/hackathons/results/bulk-update",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating bulk HackathonResults:", error);
      throw error;
    }
  }
}
export const hackathonResultService = new HackathonResultService();
