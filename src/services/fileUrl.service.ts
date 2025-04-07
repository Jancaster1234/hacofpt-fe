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

  async uploadMultipleFiles(files: File[]): Promise<FileUrl[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        "/hackathon-service/api/v1/upload/multiple",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.code === 1000) {
        return data
      } else {
        throw new Error("File upload failed, no data returned.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  async uploadMultipleFilesCommunication(files: File[]): Promise<FileUrl[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        "/communication-service/api/v1/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.code === 1000) {
        return data
      } else {
        throw new Error("File upload failed, no data returned.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }
}
export const fileUrlService = new FileUrlService();
