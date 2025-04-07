import { apiService } from "@/services/apiService_v0";
import { ThreadPostReport } from "@/types/entities/threadPostReport";

type ThreadPostReportPayload = {
  threadPostId: string;
  reason: string;
  status: "PENDING" | "REVIEWED" | "DISMISSED";
};

class ThreadPostReportService {
  async createThreadPostReport(data: ThreadPostReportPayload): Promise<ThreadPostReport> {
    try {
      const response = await apiService.auth.post<ThreadPostReport>(
        "/communication-service/api/v1/thread-post-reports",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Thread Post Report:", error);
      throw error;
    }
  }

  async getAllThreadPostReports(): Promise<ThreadPostReport[]> {
    try {
      const response = await apiService.auth.get<ThreadPostReport[]>("/communication-service/api/v1/thread-post-reports");
      return response.data;
    } catch (error) {
      console.error("Error fetching all Thread Post Reports:", error);
      throw error;
    }
  }

  async getThreadPostReport(id: string): Promise<ThreadPostReport> {
    try {
      const response = await apiService.auth.get<ThreadPostReport>(`/communication-service/api/v1/thread-post-reports/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Thread Post Report by ID:", error);
      throw error;
    }
  }

  async getReportsByThreadPostId(threadPostId: string): Promise<ThreadPostReport[]> {
    try {
      const response = await apiService.auth.get<ThreadPostReport[]>(
        `/communication-service/api/v1/thread-post-reports/thread-post/${threadPostId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reports by Thread Post ID:", error);
      throw error;
    }
  }

  async updateThreadPostReport(id: string, data: ThreadPostReportPayload): Promise<ThreadPostReport> {
    try {
      const response = await apiService.auth.put<ThreadPostReport>(
        `/communication-service/api/v1/thread-post-reports/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Thread Post Report:", error);
      throw error;
    }
  }

  async deleteThreadPostReport(id: string): Promise<void> {
    try {
      await apiService.auth.delete(`/communication-service/api/v1/thread-post-reports/${id}`);
    } catch (error) {
      console.error("Error deleting Thread Post Report:", error);
      throw error;
    }
  }
}
export const threadPostReportService = new ThreadPostReportService();
