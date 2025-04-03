// src/services/fileUrl.service.ts
import { FileUrl } from "@/types/entities/fileUrl";
import { tokenService_v0 } from "@/services/token.service_v0";

class FileUrlService {

  async uploadFile(file: File): Promise<FileUrl> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/hackathon-service/api/v1/upload/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}

export const fileUrlService = new FileUrlService();
