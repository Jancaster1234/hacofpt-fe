// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockBoardLabels.ts
import { BoardLabel } from "@/types/entities/boardLabel";

export const fetchMockBoardLabelsByBoardId = (
  boardId: string
): Promise<BoardLabel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockBoardLabels: BoardLabel[] = [
        {
          id: "label1",
          name: "High Priority",
          color: "#FF0000",
          boardId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "label2",
          name: "Bug",
          color: "#FF00FF",
          boardId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "label3",
          name: "Feature",
          color: "#00FF00",
          boardId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockBoardLabels);
    }, 500);
  });
};
