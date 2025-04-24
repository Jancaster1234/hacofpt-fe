// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockTaskFilesByTaskId.tsx
import { FileUrl } from "@/types/entities/fileUrl";

export const fetchMockTaskFilesByTaskId = (
  taskId: string
): Promise<FileUrl[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTaskFiles: FileUrl[] = [
        {
          id: "file1",
          taskId,
          fileName: "setup-instructions.pdf",
          fileUrl: "https://example.com/files/setup-instructions.pdf",
          fileType: "application/pdf",
          fileSize: 2048000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "johnsmith",
        },
        {
          id: "file2",
          taskId,
          fileName: "architecture-diagram.png",
          fileUrl: "https://example.com/files/architecture-diagram.png",
          fileType: "image/png",
          fileSize: 1048576,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "janedoe",
        },
      ];
      resolve(mockTaskFiles);
    }, 500);
  });
};
