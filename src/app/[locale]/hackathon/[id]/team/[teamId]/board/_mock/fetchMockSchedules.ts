// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockSchedules.ts
import { Schedule } from "@/types/entities/schedule";

export const fetchMockSchedules = (
  teamId?: string | null,
  hackathonId?: string
): Promise<Schedule> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSchedule: Schedule = {
        id: "schedule1",
        teamId: teamId ?? undefined,
        hackathonId: hackathonId,
        name: "Sprint Planning",
        description: "Planning the upcoming sprint.",
        createdByUserName: "your_username",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resolve(mockSchedule);
    }, 500);
  });
};
