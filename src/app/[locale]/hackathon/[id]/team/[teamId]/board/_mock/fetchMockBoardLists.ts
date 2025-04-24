// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockBoardLists.ts
import { BoardList } from "@/types/entities/boardList";

export const fetchMockBoardListsByBoardId = (
  boardId: string
): Promise<BoardList[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockBoardLists: BoardList[] = [
        {
          id: "list1",
          name: "To Do",
          position: 0,
          boardId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "johnsmith",
        },
      ];
      resolve(mockBoardLists);
    }, 500);
  });
};
