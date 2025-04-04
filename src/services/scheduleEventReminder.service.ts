// src/services/scheduleEventReminder.service.ts
import { apiService } from "@/services/apiService_v0";
import { ScheduleEventReminder } from "@/types/entities/scheduleEventReminder";

type ScheduleEventReminderRequestPayload = {
  scheduleEventId: string;
  userId: string;
  remindAt: string;
};

class ScheduleEventReminderService {
  
  // Create a new reminder for a schedule event
  async createScheduleEventReminder(data: ScheduleEventReminderRequestPayload): Promise<ScheduleEventReminder> {
    try {
      const response = await apiService.auth.post<ScheduleEventReminder>(
        "/communication-service/api/v1/schedule-event-reminders",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Schedule Event Reminder:", error);
      throw error;
    }
  }

  // Update an existing reminder for a schedule event
  async updateScheduleEventReminder(id: string, data: ScheduleEventReminderRequestPayload): Promise<ScheduleEventReminder> {
    try {
      const response = await apiService.auth.put<ScheduleEventReminder>(
        `/communication-service/api/v1/schedule-event-reminders/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Schedule Event Reminder:", error);
      throw error;
    }
  }

  // Delete a schedule event reminder
  async deleteScheduleEventReminder(id: string): Promise<void> {
    try {
      const response = await apiService.auth.delete<void>(
        `/communication-service/api/v1/schedule-event-reminders/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting Schedule Event Reminder:", error);
      throw error;
    }
  }

  // Get a schedule event reminder by ID
  async getScheduleEventReminder(id: string): Promise<ScheduleEventReminder> {
    try {
      const response = await apiService.auth.get<ScheduleEventReminder>(
        `/communication-service/api/v1/schedule-event-reminders/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Schedule Event Reminder:", error);
      throw error;
    }
  }

  // Get all schedule event reminders for a specific user
  async getScheduleEventRemindersByUserId(userId: string): Promise<ScheduleEventReminder[]> {
    try {
      const response = await apiService.auth.get<ScheduleEventReminder[]>(
        `/communication-service/api/v1/schedule-event-reminders/by-user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Schedule Event Reminders for user:", error);
      throw error;
    }
  }

  // Get all schedule event reminders for a specific schedule event
  async getScheduleEventRemindersByScheduleEventId(scheduleEventId: string): Promise<ScheduleEventReminder[]> {
    try {
      const response = await apiService.auth.get<ScheduleEventReminder[]>(
        `/communication-service/api/v1/schedule-event-reminders/by-schedule-event/${scheduleEventId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Schedule Event Reminders for schedule event:", error);
      throw error;
    }
  }

  // Get all schedule event reminders
  async getAllScheduleEventReminders(): Promise<ScheduleEventReminder[]> {
    try {
      const response = await apiService.auth.get<ScheduleEventReminder[]>(
        `/communication-service/api/v1/schedule-event-reminders`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all Schedule Event Reminders:", error);
      throw error;
    }
  }
}

export const scheduleEventReminderService = new ScheduleEventReminderService();
