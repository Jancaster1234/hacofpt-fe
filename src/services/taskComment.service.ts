import { apiService } from "@/services/apiService_v0";
import { TaskComment } from "@/types/entities/taskComment";

type TaskCommentPayload = {
  taskId: string;
  content: string;
};

class TaskCommentService {

  // Create a new Task Comment
  async createTaskComment(data: TaskCommentPayload): Promise<TaskComment> {
    try {
      const response = await apiService.auth.post<TaskComment>("/communication-service/api/v1/task-comments", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TaskComment:", error);
      throw error;
    }
  }

  // Update an existing Task Comment
  async updateTaskComment(id: string, data: TaskCommentPayload): Promise<TaskComment> {
    try {
      const response = await apiService.auth.put<TaskComment>(`/communication-service/api/v1/task-comments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TaskComment:", error);
      throw error;
    }
  }

  // Delete a Task Comment by its ID
  async deleteTaskComment(id: string): Promise<void> {
    try {
      await apiService.auth.delete<void>(`/communication-service/api/v1/task-comments/${id}`);
    } catch (error) {
      console.error("Error deleting TaskComment:", error);
      throw error;
    }
  }

  // Get a specific Task Comment by its ID
  async getTaskComment(id: string): Promise<TaskComment> {
    try {
      const response = await apiService.auth.get<TaskComment>(`/communication-service/api/v1/task-comments/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching TaskComment by ID:", error);
      throw error;
    }
  }

  // Get all Task Comments
  async getAllTaskComments(): Promise<TaskComment[]> {
    try {
      const response = await apiService.auth.get<TaskComment[]>("/communication-service/api/v1/task-comments");
      return response.data;
    } catch (error) {
      console.error("Error fetching all TaskComments:", error);
      throw error;
    }
  }

  // Get Task Comments by Task ID
  async getTaskCommentsByTaskId(taskId: string): Promise<TaskComment[]> {
    try {
      const response = await apiService.auth.get<TaskComment[]>(`/communication-service/api/v1/task-comments/by-task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching TaskComments by Task ID:", error);
      throw error;
    }
  }
}

export const taskCommentService = new TaskCommentService();
