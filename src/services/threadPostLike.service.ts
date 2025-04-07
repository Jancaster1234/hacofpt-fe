import { apiService } from "@/services/apiService_v0";
import { ThreadPostLike } from "@/types/entities/threadPostLike";

type ThreadPostLikePayload = {
  threadPostId: string;
};

class ThreadPostLikeService {
  async createThreadPostLike(data: ThreadPostLikePayload): Promise<ThreadPostLike> {
    try {
      const response = await apiService.auth.post<ThreadPostLike>(
        "/communication-service/api/v1/thread-post-likes",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Thread Post Like:", error);
      throw error;
    }
  }

  async getAllThreadPostLikes(): Promise<ThreadPostLike[]> {
    try {
      const response = await apiService.auth.get<ThreadPostLike[]>("/communication-service/api/v1/thread-post-likes");
      return response.data;
    } catch (error) {
      console.error("Error fetching all Thread Post Likes:", error);
      throw error;
    }
  }

  async getThreadPostLike(id: string): Promise<ThreadPostLike> {
    try {
      const response = await apiService.auth.get<ThreadPostLike>(`/communication-service/api/v1/thread-post-likes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Thread Post Like by ID:", error);
      throw error;
    }
  }

  async getLikesByThreadPostId(threadPostId: string): Promise<ThreadPostLike[]> {
    try {
      const response = await apiService.auth.get<ThreadPostLike[]>(
        `/communication-service/api/v1/thread-post-likes/thread-post/${threadPostId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching likes by Thread Post ID:", error);
      throw error;
    }
  }

  async deleteThreadPostLike(id: string): Promise<void> {
    try {
      await apiService.auth.delete(`/communication-service/api/v1/thread-post-likes/${id}`);
    } catch (error) {
      console.error("Error deleting Thread Post Like:", error);
      throw error;
    }
  }
}
export const threadPostLikeService = new ThreadPostLikeService();
