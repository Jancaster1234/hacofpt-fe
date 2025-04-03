// src/services/round.service.ts
import { apiService } from "@/services/apiService_v0";
import { Round } from "@/types/entities/round";

type RoundPayload = {
  id?: string;
  hackathonId: string;
  startTime: string;
  endTime: string;
  roundNumber: number;
  roundTitle: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  roundLocations?: string[];
};

class RoundService {
  async createRound(data: RoundPayload): Promise<Round> {
    try {
      const response = await apiService.auth.post<Round>(
        "/hackathon-service/api/v1/rounds",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Round:", error);
      throw error;
    }
  }

  async updateRound(data: RoundPayload): Promise<Round> {
    try {
      const response = await apiService.auth.put<Round>(
        `/hackathon-service/api/v1/rounds`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Round:", error);
      throw error;
    }
  }

  async getRoundsByHackathonId(hackathonId: string): Promise<Round[]> {
    try {
      const response = await apiService.auth.get<Round[]>(
        `/hackathon-service/api/v1/rounds?hackathonId=${hackathonId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching rounds by hackathonId:", error);
      throw error;
    }
  }

  async deleteRound(id: string): Promise<void> {
    try {
      const requestData = {
        id: id
      };

      const response = await fetch("/hackathon-service/api/v1/rounds", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete round: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

export const roundService = new RoundService();
