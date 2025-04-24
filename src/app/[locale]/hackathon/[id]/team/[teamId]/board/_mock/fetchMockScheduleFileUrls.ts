// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_mock/fetchMockScheduleFileUrls.ts
import { FileUrl } from "@/types/entities/fileUrl";

export const fetchMockFileUrls = (
  scheduleEventId?: string
): Promise<FileUrl[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockFileUrls: FileUrl[] = [
        {
          id: "file1",
          fileName: "project_docs.pdf",
          fileUrl: "https://example.com/files/project_docs.pdf",
          fileType: "application/pdf",
          fileSize: 102400,
          scheduleEventId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "file2",
          fileName: "meeting_notes.txt",
          fileUrl: "https://example.com/files/meeting_notes.txt",
          fileType: "text/plain",
          fileSize: 2048,
          scheduleEventId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockFileUrls);
    }, 500);
  });
};
