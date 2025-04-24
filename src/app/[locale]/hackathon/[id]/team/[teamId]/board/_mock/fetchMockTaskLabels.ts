// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockTaskLabels.ts
import { TaskLabel } from "@/types/entities/taskLabel";

export const fetchMockTaskLabelsByTaskId = (
  taskId: string
): Promise<TaskLabel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTaskLabels: TaskLabel[] = [
        {
          id: "taskLabel1",
          taskId,
          boardLabelId: "label1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "taskLabel2",
          taskId,
          boardLabelId: "label2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTaskLabels);
    }, 500);
  });
};
