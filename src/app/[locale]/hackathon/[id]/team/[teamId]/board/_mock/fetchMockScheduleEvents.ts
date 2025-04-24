// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockScheduleEvents.ts
import { ScheduleEvent } from "@/types/entities/scheduleEvent";

export const fetchMockScheduleEvents = (
  scheduleId?: string
): Promise<ScheduleEvent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockScheduleEvents: ScheduleEvent[] = [
        {
          id: "event1",
          scheduleId,
          name: "Daily Standup",
          description: "Quick status update meeting",
          location: "Zoom",
          startTime: new Date().toISOString(),
          endTime: new Date(new Date().getTime() + 3600000).toISOString(),
          eventLabel: "primary",
          isRecurring: true,
          recurrenceRule: "FREQ=DAILY;INTERVAL=1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "event2",
          scheduleId,
          name: "Code Review",
          description: "Reviewing pull requests",
          location: "Google Meet",
          startTime: new Date().toISOString(),
          endTime: new Date(new Date().getTime() + 7200000).toISOString(),
          eventLabel: "warning",
          isRecurring: false,
          recurrenceRule: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockScheduleEvents);
    }, 500);
  });
};
