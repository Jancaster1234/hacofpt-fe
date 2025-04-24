// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockTasksByBoardListId.ts
import { Task } from "@/types/entities/task";

export const fetchMockTasksByBoardListId = (
  boardListId: string
): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTasks: Task[] = [
        {
          id: "task1",
          title: "Set up project repository",
          description: "Initialize Git repository and configure CI/CD",
          position: 0,
          boardListId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "johnsmith",
        },
        {
          id: "task2",
          title: "Design database schema",
          description: "Create initial DB schema and migration scripts",
          position: 1,
          boardListId,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "janedoe",
        },
      ];
      resolve(mockTasks);
    }, 500);
  });
};
