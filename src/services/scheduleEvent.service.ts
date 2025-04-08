// src/services/scheduleEvent.service.ts
import { apiService } from "@/services/apiService_v0"; // import your apiService
import { ScheduleEvent } from "@/types/entities/scheduleEvent";

type ScheduleEventRequestPayload = {
  scheduleId: string;
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrenceRule: string;
  fileUrls: string[]; 
};

class ScheduleEventService {

  // Create a new schedule event
  async createScheduleEvent(data: ScheduleEventRequestPayload): Promise<ScheduleEvent> {
    try {
      const response = await apiService.auth.post<ScheduleEvent>(
        "/communication-service/api/v1/schedule-events", 
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating schedule event:", error);
      throw error;
    }
  }

  // Update a schedule event by ID
  async updateScheduleEvent(id: string, data: ScheduleEventRequestPayload): Promise<ScheduleEvent> {
    try {
      const response = await apiService.auth.put<ScheduleEvent>(
        `/communication-service/api/v1/schedule-events/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating schedule event:", error);
      throw error;
    }
  }

  // Delete a schedule event by ID
  async deleteScheduleEvent(id: string): Promise<void> {
    try {
      const response = await apiService.auth.delete<void>(
        `/communication-service/api/v1/schedule-events/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting schedule event:", error);
      throw error;
    }
  }

  // Get a schedule event by ID
  async getScheduleEventById(id: string): Promise<ScheduleEvent> {
    try {
      const response = await apiService.auth.get<ScheduleEvent>(
        `/communication-service/api/v1/schedule-events/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedule event:", error);
      throw error;
    }
  }

  // Get all schedule events
  async getAllScheduleEvents(): Promise<ScheduleEvent[]> {
    try {
      const response = await apiService.auth.get<ScheduleEvent[]>(
        "/communication-service/api/v1/schedule-events"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all schedule events:", error);
      throw error;
    }
  }

  // Get schedule events filtered by scheduleId
  async getScheduleEventsByScheduleId(scheduleId: string): Promise<ScheduleEvent[]> {
    try {
      const response = await apiService.auth.get<ScheduleEvent[]>(
        `/communication-service/api/v1/schedule-events/by-schedule/${scheduleId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedule events by scheduleId:", error);
      throw error;
    }
  }
}

export const scheduleEventService = new ScheduleEventService();
