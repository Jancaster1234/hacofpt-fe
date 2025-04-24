// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockScheduleEventReminders.ts
import { ScheduleEventReminder } from "@/types/entities/scheduleEventReminder";

export const fetchMockScheduleEventReminders = (
  scheduleEventId?: string
): Promise<ScheduleEventReminder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockReminders: ScheduleEventReminder[] = [
        {
          id: "reminder1",
          scheduleEventId,
          userId: "user123",
          remindAt: new Date(new Date().getTime() + 1800000).toISOString(), // Reminder 30 minutes before event
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reminder2",
          scheduleEventId,
          userId: "user456",
          remindAt: new Date(new Date().getTime() + 3600000).toISOString(), // Reminder 1 hour before event
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockReminders);
    }, 500);
  });
};
