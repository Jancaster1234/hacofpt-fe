import { apiService } from "@/services/apiService_v0";
import { TaskAssignee } from "@/types/entities/taskAssignee";

type TaskAssigneePayload = {
  taskId: string;
  userId: string;
};

class TaskAssigneeService {

  // Create a new TaskAssignee
  async createTaskAssignee(data: TaskAssigneePayload): Promise<TaskAssignee> {
    try {
      const response = await apiService.auth.post<TaskAssignee>("/communication-service/api/v1/task-assignees", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TaskAssignee:", error);
      throw error;
    }
  }

  // Update an existing TaskAssignee
  async updateTaskAssignee(id: string, data: TaskAssigneePayload): Promise<TaskAssignee> {
    try {
      const response = await apiService.auth.put<TaskAssignee>(`/communication-service/api/v1/task-assignees/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TaskAssignee:", error);
      throw error;
    }
  }

  // Delete a TaskAssignee by its ID
  async deleteTaskAssignee(id: string): Promise<void> {
    try {
      await apiService.auth.delete<void>(`/communication-service/api/v1/task-assignees/${id}`);
    } catch (error) {
      console.error("Error deleting TaskAssignee:", error);
      throw error;
    }
  }

  // Get a specific TaskAssignee by its ID
  async getTaskAssignee(id: string): Promise<TaskAssignee> {
    try {
      const response = await apiService.auth.get<TaskAssignee>(`/communication-service/api/v1/task-assignees/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching TaskAssignee by ID:", error);
      throw error;
    }
  }

  // Get all TaskAssignees
  async getAllTaskAssignees(): Promise<TaskAssignee[]> {
    try {
      const response = await apiService.auth.get<TaskAssignee[]>("/communication-service/api/v1/task-assignees");
      return response.data;
    } catch (error) {
      console.error("Error fetching all TaskAssignees:", error);
      throw error;
    }
  }

  // Get TaskAssignees by Task ID
  async getTaskAssigneesByTaskId(taskId: string): Promise<TaskAssignee[]> {
    try {
      const response = await apiService.auth.get<TaskAssignee[]>(`/communication-service/api/v1/task-assignees/by-task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching TaskAssignees by Task ID:", error);
      throw error;
    }
  }
}

export const taskAssigneeService = new TaskAssigneeService();
