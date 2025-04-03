// src/services/roundLocation.service.ts
import { apiService } from "@/services/apiService_v0";
import { RoundLocation } from "@/types/entities/roundLocation";

type RoundLocationPayload = {
  id?: string;
  roundId: string;
  locationId: string;
  type: "ONLINE" | "OFFLINE" | "HYBRID";
};

class RoundLocationService {
  async createRoundLocation(
    data: RoundLocationPayload
  ): Promise<RoundLocation> {
    try {
      const response = await apiService.auth.post<RoundLocation>(
        "hackathon-service/api/v1/round-locations",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating RoundLocation:", error);
      throw error;
    }
  }

  async updateRoundLocation(
    data: RoundLocationPayload
  ): Promise<RoundLocation> {
    try {
      const response = await apiService.auth.put<RoundLocation>(
        `hackathon-service/api/v1/round-locations`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating RoundLocation:", error);
      throw error;
    }
  }

  async deleteRoundLocation(id: string): Promise<void> {
    try {
      const requestData = {
        id: id,
      };

      const response = await fetch("/hackathon-service/api/v1/rounds/locations", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete round location: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

export const roundLocationService = new RoundLocationService();
