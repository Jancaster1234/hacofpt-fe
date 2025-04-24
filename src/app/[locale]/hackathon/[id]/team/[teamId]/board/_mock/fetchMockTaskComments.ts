// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockTaskComments.ts
import { TaskComment } from "@/types/entities/taskComment";

export const fetchMockTaskCommentsByTaskId = (
  taskId: string
): Promise<TaskComment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTaskComments: TaskComment[] = [
        {
          id: "comment1",
          content: "I'll start on this tomorrow morning",
          taskId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "johnsmith",
        },
        {
          id: "comment2",
          content: "Make sure to review the schema before implementation",
          taskId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "janedoe",
        },
      ];
      resolve(mockTaskComments);
    }, 500);
  });
};
