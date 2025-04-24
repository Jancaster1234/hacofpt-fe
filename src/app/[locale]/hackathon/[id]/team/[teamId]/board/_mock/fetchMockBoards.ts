// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockBoards.ts
import { Board } from "@/types/entities/board";

export const fetchMockBoardsByTeamId = (
  teamId: string,
  hackathonId: string
): Promise<Board[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockBoards: Board[] = [
        {
          id: "board1",
          name: "Project Alpha",
          description: "Main board for Project Alpha planning and tracking",
          owner: {
            id: "5",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@example.com",
            username: "johnsmith",
            avatarUrl: "https://example.com/john-avatar.png",
            status: "Active",
          },
          boardUsers: [
            {
              id: "5",
              user: {
                id: "user123",
                firstName: "John",
                lastName: "Smith",
                email: "john.smith@example.com",
                username: "johnsmith",
                avatarUrl: "https://example.com/john-avatar.png",
                status: "Active",
              },
              role: "ADMIN",
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "bu2",
              user: {
                id: "user456",
                firstName: "Jane",
                lastName: "Doe",
                email: "jane.doe@example.com",
                username: "janedoe",
                avatarUrl: "https://example.com/jane-avatar.png",
                status: "Active",
              },
              role: "MEMBER",
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          boardLists: [
            {
              id: "list1",
              name: "To Do",
              position: 0,
              tasks: [
                {
                  id: "task1",
                  title: "Set up project repository",
                  description: "Initialize Git repository and configure CI/CD",
                  position: 0,
                  dueDate: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toISOString(),
                  fileUrls: [
                    {
                      id: "file1",
                      fileName: "setup-instructions.pdf",
                      fileUrl:
                        "https://example.com/files/setup-instructions.pdf",
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
                  id: "task2",
                  title: "Design database schema",
                  description: "Create initial DB schema and migration scripts",
                  position: 1,
                  dueDate: new Date(
                    Date.now() + 5 * 24 * 60 * 60 * 1000
                  ).toISOString(),
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
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdByUserName: "johnsmith",
            },
            {
              id: "list2",
              name: "In Progress",
              position: 1,
              tasks: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdByUserName: "johnsmith",
            },
            {
              id: "list3",
              name: "Done",
              position: 2,
              tasks: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdByUserName: "johnsmith",
            },
          ],
          boardLabels: [
            {
              id: "label1",
              name: "High Priority",
              color: "#FF0000",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "label2",
              name: "Bug",
              color: "#FF00FF",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "label3",
              name: "Feature",
              color: "#00FF00",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "johnsmith",
        },
        {
          id: "board2",
          name: "Project Beta",
          description: "Planning board for upcoming Project Beta",
          owner: {
            id: "5",
            firstName: "Jane",
            lastName: "Doe",
            email: "jane.doe@example.com",
            username: "janedoe",
            avatarUrl: "https://example.com/jane-avatar.png",
            status: "Active",
          },
          boardUsers: [
            {
              id: "bu3",
              user: {
                id: "5",
                firstName: "Jane",
                lastName: "Doe",
                email: "jane.doe@example.com",
                username: "janedoe",
                avatarUrl: "https://example.com/jane-avatar.png",
                status: "Active",
              },
              role: "ADMIN",
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "bu4",
              user: {
                id: "user789",
                firstName: "Alex",
                lastName: "Johnson",
                email: "alex.johnson@example.com",
                username: "alexj",
                avatarUrl: "https://example.com/alex-avatar.png",
                status: "Active",
              },
              role: "MEMBER",
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          boardLists: [
            {
              id: "list4",
              name: "Backlog",
              position: 0,
              tasks: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdByUserName: "janedoe",
            },
            {
              id: "list5",
              name: "To Do",
              position: 1,
              tasks: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdByUserName: "janedoe",
            },
          ],
          boardLabels: [
            {
              id: "label4",
              name: "Low Priority",
              color: "#0000FF",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "label5",
              name: "Documentation",
              color: "#FFFF00",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "janedoe",
        },
      ];

      resolve(mockBoards);
    }, 500);
  });
};
