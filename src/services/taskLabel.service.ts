import { apiService } from "@/services/apiService_v0";
import { TaskLabel } from "@/types/entities/taskLabel"; // Assuming TaskLabel is your entity

type TaskLabelPayload = {
  taskId: string;
  boardLabelId: string;
};

class TaskLabelService {

  // Create a new Task Label
  async createTaskLabel(data: TaskLabelPayload): Promise<TaskLabel> {
    try {
      const response = await apiService.auth.post<TaskLabel>("/communication-service/api/v1/task-labels", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TaskLabel:", error);
      throw error;
    }
  }

  // Update an existing Task Label
  async updateTaskLabel(id: string, data: TaskLabelPayload): Promise<TaskLabel> {
    try {
      const response = await apiService.auth.put<TaskLabel>(`/communication-service/api/v1/task-labels/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TaskLabel:", error);
      throw error;
    }
  }

  // Delete a Task Label by its ID
  async deleteTaskLabel(id: string): Promise<void> {
    try {
      await apiService.auth.delete<void>(`/communication-service/api/v1/task-labels/${id}`);
    } catch (error) {
      console.error("Error deleting TaskLabel:", error);
      throw error;
    }
  }

  // Get a specific Task Label by its ID
  async getTaskLabel(id: string): Promise<TaskLabel> {
    try {
      const response = await apiService.auth.get<TaskLabel>(`/communication-service/api/v1/task-labels/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching TaskLabel by ID:", error);
      throw error;
    }
  }

  // Get all Task Labels
  async getAllTaskLabels(): Promise<TaskLabel[]> {
    try {
      const response = await apiService.auth.get<TaskLabel[]>("/communication-service/api/v1/task-labels");
      return response.data;
    } catch (error) {
      console.error("Error fetching all TaskLabels:", error);
      throw error;
    }
  }
}

export const taskLabelService = new TaskLabelService();
