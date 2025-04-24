// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockBoardUsers.ts
import { BoardUser } from "@/types/entities/boardUser";

export const fetchMockBoardUsers = (boardId: string): Promise<BoardUser[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockBoardUsers: BoardUser[] = [
        {
          id: "bu1",
          boardId,
          user: {
            id: "user123",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@example.com",
            username: "johnsmith",
            avatarUrl: "https://example.com/john-avatar.png",
            status: "Active",
          },
          userId: "user123",
          role: "ADMIN",
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "bu2",
          boardId,
          user: {
            id: "user456",
            firstName: "Jane",
            lastName: "Doe",
            email: "jane.doe@example.com",
            username: "janedoe",
            avatarUrl: "https://example.com/jane-avatar.png",
            status: "Active",
          },
          userId: "user456",
          role: "MEMBER",
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockBoardUsers);
    }, 500);
  });
};
