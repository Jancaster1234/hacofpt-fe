// src/services/hackathon.service.ts
import { apiService } from "@/services/apiService_v0";
import { Hackathon } from "@/types/entities/hackathon";

// type HackathonPayload = {
//   id?: string;
//   title: string;
//   subtitle: string;
//   bannerImageUrl: string;
//   enrollStartDate: string;
//   enrollEndDate: string;
//   enrollmentCount: number;
//   startDate: string;
//   endDate: string;
//   information: string;
//   description: string;
//   contact: string;
//   category: string;
//   organization: string;
//   status: "DRAFT" | "OPEN" | "ONGOING" | "CLOSED";
//   minimumTeamMembers: number;
//   maximumTeamMembers: number;
// };

class HackathonService {
  async getAllHackathons(): Promise<Partial<Hackathon>[]> {
    try {
      const response = await apiService.auth.get<Partial<Hackathon>[]>(
        "/hackathon-service/api/v1/hackathons"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all hackathons:", error);
      throw error;
    }
  }

  async getHackathonById(id: string): Promise<Partial<Hackathon>> {
    try {
      const response = await apiService.auth.get<Partial<Hackathon>>(
        `/hackathon-service/api/v1/hackathons?id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching hackathon by ID:", error);
      throw error;
    }
  }

  async createHackathon(data): Promise<Hackathon> {
    try {
      const response = await apiService.auth.post<Hackathon>(
        "/hackathon-service/api/v1/hackathons",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Hackathon:", error);
      throw error;
    }
  }

  async updateHackathon(data): Promise<Hackathon> {
    try {
      const response = await apiService.auth.put<Hackathon>(
        "/hackathon-service/api/v1/hackathons",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Hackathon:", error);
      throw error;
    }
  }
}

export const hackathonService = new HackathonService();
