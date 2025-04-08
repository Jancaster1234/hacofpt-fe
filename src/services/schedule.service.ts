// src/services/schedule.service.ts
import { apiService } from "@/services/apiService_v0"; // Importing the api service
import { Schedule } from "@/types/entities/schedule";

type ScheduleRequestPayload = {
  teamId: string;
  hackathonId: string;
  name: string;
  description: string;
};

class ScheduleService {

  // Create a new schedule
  async createSchedule(data: ScheduleRequestPayload): Promise<Schedule> {
    try {
      const response = await apiService.auth.post<Schedule>(
        "/communication-service/api/v1/schedules", 
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }

  // Update a schedule by ID
  async updateSchedule(id: string, data: ScheduleRequestPayload): Promise<Schedule> {
    try {
      const response = await apiService.auth.put<Schedule>(
        `/communication-service/api/v1/schedules/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  }

  // Delete a schedule by ID
  async deleteSchedule(id: string): Promise<void> {
    try {
      const response = await apiService.auth.delete<void>(
        `/communication-service/api/v1/schedules/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  }

  // Get a schedule by ID
  async getScheduleById(id: string): Promise<Schedule> {
    try {
      const response = await apiService.auth.get<Schedule>(
        `/communication-service/api/v1/schedules/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedule:", error);
      throw error;
    }
  }

  // Get all schedules
  async getAllSchedules(): Promise<Schedule[]> {
    try {
      const response = await apiService.auth.get<Schedule[]>(
        "/communication-service/api/v1/schedules"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all schedules:", error);
      throw error;
    }
  }

  // Get schedules filtered by teamId
  async getSchedulesByTeamId(teamId: string): Promise<Schedule[]> {
    try {
      const response = await apiService.auth.get<Schedule[]>(
        `/communication-service/api/v1/schedules/by-team/${teamId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules by teamId:", error);
      throw error;
    }
  }

  // Get schedules filtered by createdByUsername and hackathonId
  async getSchedulesByCreatedByUsernameAndHackathonId(
    createdByUsername: string, hackathonId: string
  ): Promise<Schedule[]> {
    try {
      const response = await apiService.auth.get<Schedule[]>(
        `/communication-service/api/v1/schedules/by-created-and-hackathon?createdByUsername=${createdByUsername}&hackathonId=${hackathonId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules by createdByUsername and hackathonId:", error);
      throw error;
    }
  }

}

export const scheduleService = new ScheduleService();
