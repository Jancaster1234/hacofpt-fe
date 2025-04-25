// src/services/forumThread.service.ts
import { ForumThread } from "@/types/entities/forumThread";
import { apiService } from "@/services/apiService_v0";
import { handleApiError } from "@/utils/errorHandler";

class ForumThreadService {
  // Generic method to create a forum thread based on user role
  async createForumThread(data: {
    title: string;
    forumCategoryId: string | number;
    isLocked?: boolean;
    isPinned?: boolean;
    isAdmin?: boolean;
  }): Promise<{ data: ForumThread; message?: string }> {
    try {
      const { isAdmin, ...threadData } = data;
      const endpoint = isAdmin
        ? "/api/v1/forum-threads/admin"
        : "/api/v1/forum-threads/member";

      const response = await apiService.auth.post<ForumThread>(endpoint, {
        data: threadData,
      });

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create forum thread");
      }

      return {
        data: response.data,
        message: response.message || "Forum thread created successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error creating forum thread:"
      );
    }
  }

  // Generic method to update a forum thread based on user role
  async updateForumThread(
    id: string,
    data: {
      title?: string;
      forumCategoryId?: string | number;
      isLocked?: boolean;
      isPinned?: boolean;
      isAdmin?: boolean;
    }
  ): Promise<{ data: ForumThread; message?: string }> {
    try {
      const { isAdmin, ...threadData } = data;
      const endpoint = isAdmin
        ? `/api/v1/forum-threads/admin/${id}`
        : `/api/v1/forum-threads/member/${id}`;

      const response = await apiService.auth.put<ForumThread>(endpoint, {
        data: threadData,
      });

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update forum thread");
      }

      return {
        data: response.data,
        message: response.message || "Forum thread updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error updating forum thread:"
      );
    }
  }

  async createAdminForumThread(data: {
    title: string;
    forumCategoryId: number;
    isLocked: boolean;
    isPinned: boolean;
  }): Promise<{ data: ForumThread; message?: string }> {
    try {
      const response = await apiService.auth.post<ForumThread>(
        "/api/v1/forum-threads/admin",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create admin forum thread"
        );
      }

      return {
        data: response.data,
        message: response.message || "Admin forum thread created successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error creating admin forum thread:"
      );
    }
  }

  async createMemberForumThread(data: {
    title: string;
    forumCategoryId: number;
  }): Promise<{ data: ForumThread; message?: string }> {
    try {
      const response = await apiService.auth.post<ForumThread>(
        "/api/v1/forum-threads/member",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create member forum thread"
        );
      }

      return {
        data: response.data,
        message: response.message || "Member forum thread created successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error creating member forum thread:"
      );
    }
  }

  async updateAdminForumThread(
    id: string,
    data: {
      title: string;
      forumCategoryId: number;
      isLocked: boolean;
      isPinned: boolean;
    }
  ): Promise<{ data: ForumThread; message?: string }> {
    try {
      const response = await apiService.auth.put<ForumThread>(
        `/api/v1/forum-threads/admin/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update admin forum thread"
        );
      }

      return {
        data: response.data,
        message: response.message || "Admin forum thread updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error updating admin forum thread:"
      );
    }
  }

  async updateMemberForumThread(
    id: string,
    data: {
      title: string;
      forumCategoryId: number;
    }
  ): Promise<{ data: ForumThread; message?: string }> {
    try {
      const response = await apiService.auth.put<ForumThread>(
        `/api/v1/forum-threads/member/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update member forum thread"
        );
      }

      return {
        data: response.data,
        message: response.message || "Member forum thread updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error updating member forum thread:"
      );
    }
  }

  async getAllForumThreads(): Promise<{
    data: ForumThread[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<ForumThread[]>(
        "/communication-service/api/v1/forum-threads"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve forum threads");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ForumThread[]>(
        error,
        [],
        "[Forum Thread Service] Error getting forum threads:"
      );
    }
  }

  async getForumThreadById(
    id: string
  ): Promise<{ data: ForumThread; message?: string }> {
    try {
      const response = await apiService.auth.get<ForumThread>(
        `/communication-service/api/v1/forum-threads/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve forum thread");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error getting forum thread:"
      );
    }
  }

  async getForumThreadsByCategoryId(
    forumCategoryId: string
  ): Promise<{ data: ForumThread[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ForumThread[]>(
        `/communication-service/api/v1/forum-threads/category/${forumCategoryId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve forum threads by category ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ForumThread[]>(
        error,
        [],
        "[Forum Thread Service] Error getting forum threads by category ID:"
      );
    }
  }

  async deleteForumThread(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/forum-threads/${id}`
      );

      return {
        message: response.message || "Forum thread deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Forum Thread Service] Error deleting forum thread:",
        error.message
      );
      throw error;
    }
  }
}

export const forumThreadService = new ForumThreadService();
