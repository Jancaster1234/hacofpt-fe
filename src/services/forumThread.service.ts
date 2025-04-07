import { ForumThread } from "@/types/entities/forumThread";
import { apiService } from "@/services/apiService_v0";

type ForumThreadPayload = {
  title: string;           
  forumCategoryId: string;  
  isLocked: boolean;
  isPinned: boolean;
};

class ForumThreadService {
    async createForumThread(data: ForumThreadPayload): Promise<ForumThread> {
    try {
      const response = await apiService.auth.post<ForumThread>(
        "/communication-service/api/v1/forum-threads",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Forum Thread:", error);
      throw error;
    }
  }

  async getAllForumThreads(): Promise<ForumThread[]> {
    try {
      const response = await apiService.auth.get<ForumThread[]>("/communication-service/api/v1/forum-threads");
      return response.data;
    } catch (error) {
      console.error("Error fetching Forum Threads:", error);
      throw error;
    }
  }

  async getForumThread(id: string): Promise<ForumThread> {
    try {
      const response = await apiService.auth.get<ForumThread>(`/communication-service/api/v1/forum-threads/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Forum Thread by ID:", error);
      throw error;
    }
  }

  async updateForumThread(id: string, data: ForumThreadPayload): Promise<ForumThread> {
    try {
      const response = await apiService.auth.put<ForumThread>(
        `/communication-service/api/v1/forum-threads/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Forum Thread:", error);
      throw error;
    }
  }

  async deleteForumThread(id: string): Promise<void> {
    try {
      await apiService.auth.delete(`/communication-service/api/v1/forum-threads/${id}`);
    } catch (error) {
      console.error("Error deleting Forum Thread:", error);
      throw error;
    }
  }
}
export const forumThreadService = new ForumThreadService();
