// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockBoard.ts
import { Board } from "@/types/entities/board";

export const fetchMockBoard = (
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "janedoe",
        },
      ];

      resolve(mockBoards);
    }, 500);
  });
};
