// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockTasks.ts
import { Task } from "@/types/entities/task";

export const fetchMockTasksByBoardListId = (
  boardListId: string
): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Set up project repository",
          description: "Initialize Git repository and configure CI/CD",
          position: 0,
          boardListId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          fileUrls: [
            {
              id: "file1",
              fileName: "setup-instructions.pdf",
              fileUrl: "https://example.com/files/setup-instructions.pdf",
              fileType: "application/pdf",
              fileSize: 2048000,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdByUserName: "johnsmith",
            },
          ],
          assignees: [
            {
              id: "assign1",
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
          ],
          comments: [
            {
              id: "comment1",
              content: "I'll start on this tomorrow morning",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdByUserName: "johnsmith",
            },
          ],
          taskLabels: [
            {
              id: "taskLabel1",
              boardLabel: {
                id: "label1",
                name: "High Priority",
                color: "#FF0000",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "johnsmith",
        },
        {
          id: "2",
          title: "Design database schema",
          description: "Create initial DB schema and migration scripts",
          position: 1,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          fileUrls: [],
          assignees: [
            {
              id: "assign2",
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
          ],
          comments: [],
          taskLabels: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "janedoe",
        },
      ];
      resolve(mockTasks);
    }, 500);
  });
};
