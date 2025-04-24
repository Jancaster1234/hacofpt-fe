// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockScheduleEventAttendees.ts
import { ScheduleEventAttendee } from "@/types/entities/scheduleEventAttendee";

export const fetchMockScheduleEventAttendees = (
  scheduleEventId?: string
): Promise<ScheduleEventAttendee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockAttendees: ScheduleEventAttendee[] = [
        {
          id: "attendee1",
          scheduleEventId,
          userId: "user123",
          status: "CONFIRMED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "attendee2",
          scheduleEventId,
          userId: "user456",
          status: "INVITED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockAttendees);
    }, 500);
  });
};
