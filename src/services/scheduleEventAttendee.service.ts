// src/services/scheduleEventAttendee.service.ts
import { apiService } from "@/services/apiService_v0"; // import your apiService
import { ScheduleEventAttendee } from "@/types/entities/scheduleEventAttendee";

type ScheduleEventAttendeeRequestPayload = {
  scheduleEventId: string;
  userId: string;
};

class ScheduleEventAttendeeService {
  
  // Add a user as an attendee for a schedule event
  async addAttendeeToScheduleEvent(data: ScheduleEventAttendeeRequestPayload): Promise<ScheduleEventAttendee> {
    try {
      const response = await apiService.auth.post<ScheduleEventAttendee>(
        "/communication-service/api/v1/schedule-event-attendees", 
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error adding attendee to schedule event:", error);
      throw error;
    }
  }

  // Update an attendee's information for a schedule event
  async updateScheduleEventAttendee(id: string, data: ScheduleEventAttendeeRequestPayload): Promise<ScheduleEventAttendee> {
    try {
      const response = await apiService.auth.put<ScheduleEventAttendee>(
        `/communication-service/api/v1/schedule-event-attendees/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating schedule event attendee:", error);
      throw error;
    }
  }

  // Remove a user as an attendee from a schedule event
  async removeAttendeeFromScheduleEvent(id: string): Promise<void> {
    try {
      const response = await apiService.auth.delete<void>(
        `/communication-service/api/v1/schedule-event-attendees/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing attendee from schedule event:", error);
      throw error;
    }
  }

  // Get all attendees for a specific schedule event
  async getAttendeesByScheduleEventId(scheduleEventId: string): Promise<ScheduleEventAttendee[]> {
    try {
      const response = await apiService.auth.get<ScheduleEventAttendee[]>(
        `/communication-service/api/v1/schedule-event-attendees/by-schedule-event/${scheduleEventId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching attendees for schedule event:", error);
      throw error;
    }
  }

  // Get all attendees for a specific user (optional use case)
  async getAttendeesByUserId(userId: string): Promise<ScheduleEventAttendee[]> {
    try {
      const response = await apiService.auth.get<ScheduleEventAttendee[]>(
        `/communication-service/api/v1/schedule-event-attendees/by-user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching attendees for user:", error);
      throw error;
    }
  }
}

export const scheduleEventAttendeeService = new ScheduleEventAttendeeService();
