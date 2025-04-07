import { apiService } from "@/services/apiService_v0";
import { ThreadPost } from "@/types/entities/threadPost";

type ThreadPostPayload = {
  forumThreadId: string; 
  content: string;
  isDeleted: boolean;
};

class ThreadPostService {
  async createThreadPost(data: ThreadPostPayload): Promise<ThreadPost> {
    try {
      const response = await apiService.auth.post<ThreadPost>(
        "/communication-service/api/v1/thread-posts",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Thread Post:", error);
      throw error;
    }
  }

  async getAllThreadPosts(): Promise<ThreadPost[]> {
    try {
      const response = await apiService.auth.get<ThreadPost[]>("/communication-service/api/v1/thread-posts");
      return response.data;
    } catch (error) {
      console.error("Error fetching Thread Posts:", error);
      throw error;
    }
  }

  async getThreadPost(id: string): Promise<ThreadPost> {
    try {
      const response = await apiService.auth.get<ThreadPost>(`/communication-service/api/v1/thread-posts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Thread Post by ID:", error);
      throw error;
    }
  }

  async updateThreadPost(id: string, data: ThreadPostPayload): Promise<ThreadPost> {
    try {
      const response = await apiService.auth.put<ThreadPost>(
        `/communication-service/api/v1/thread-posts/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Thread Post:", error);
      throw error;
    }
  }

  async deleteThreadPost(id: string): Promise<void> {
    try {
      await apiService.auth.delete(`/communication-service/api/v1/thread-posts/${id}`);
    } catch (error) {
      console.error("Error deleting Thread Post:", error);
      throw error;
    }
  }
}
export const threadPostService = new ThreadPostService();
