// src/services/forumCategory.service.ts
import { ForumCategory } from "@/types/entities/forumCategory";
import { apiService } from "@/services/apiService_v0";

type ForumCategoryPayload = {
  name: string;
  description?: string;     
  section: string;      
};

class ForumCategoryService {
  async createForumCategory(data: ForumCategoryPayload): Promise<ForumCategory> {
    try {
      const response = await apiService.auth.post<ForumCategory>(
        "/communication-service/api/v1/forum-categories",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Forum Category:", error);
      throw error;
    }
  }

  async getAllForumCategories(): Promise<ForumCategory[]> {
    try {
      const response = await apiService.auth.get<ForumCategory[]>("/communication-service/api/v1/forum-categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching Forum Categories:", error);
      throw error;
    }
  }

  async getForumCategoryById(id: string): Promise<ForumCategory> {
    try {
      const response = await apiService.auth.get<ForumCategory>(`/communication-service/api/v1/forum-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Forum Category by ID:", error);
      throw error;
    }
  }

  async updateForumCategory(id: string, data: ForumCategoryPayload): Promise<ForumCategory> {
    try {
      const response = await apiService.auth.put<ForumCategory>(
        `/communication-service/api/v1/forum-categories/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Forum Category:", error);
      throw error;
    }
  }

  async deleteForumCategory(id: string): Promise<void> {
    try {
      await apiService.auth.delete(`/communication-service/api/v1/forum-categories/${id}`);
    } catch (error) {
      console.error("Error deleting Forum Category:", error);
      throw error;
    }
  }
}
export const forumCategoryService = new ForumCategoryService();
