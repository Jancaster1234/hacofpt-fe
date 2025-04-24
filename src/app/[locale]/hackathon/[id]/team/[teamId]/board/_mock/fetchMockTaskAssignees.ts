// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockTaskAssignees.ts
import { TaskAssignee } from "@/types/entities/taskAssignee";

export const fetchMockTaskAssigneesByTaskId = (
  taskId: string
): Promise<TaskAssignee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTaskAssignees: TaskAssignee[] = [
        {
          id: "assign1",
          taskId,
          user: {
            id: "user123",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@example.com",
            username: "johnsmith",
            avatarUrl: "https://example.com/john-avatar.png",
            status: "Active",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "assign2",
          taskId,
          user: {
            id: "user456",
            firstName: "Jane",
            lastName: "Doe",
            email: "jane.doe@example.com",
            username: "janedoe",
            avatarUrl: "https://example.com/jane-avatar.png",
            status: "Active",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTaskAssignees);
    }, 500);
  });
};
