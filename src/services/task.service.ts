import { apiService } from "@/services/apiService_v0";
import { Task } from "@/types/entities/task"; // Assuming Task is your entity

type TaskPayload = {
  title: string;
  description: string;
  position: number;
  boardListId: string;
  dueDate: string;
  assignees: string[]; // list of assignee ids
  comments: string[];  // list of comment ids
  taskLabels: string[]; // list of task label ids
};

class TaskService {

  // Create a new Task
  async createTask(data: TaskPayload): Promise<Task> {
    try {
      const response = await apiService.auth.post<Task>("/communication-service/api/v1/tasks", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Task:", error);
      throw error;
    }
  }

  // Update an existing Task
  async updateTask(id: string, data: TaskPayload): Promise<Task> {
    try {
      const response = await apiService.auth.put<Task>(`/communication-service/api/v1/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Task:", error);
      throw error;
    }
  }

  // Delete a Task by its ID
  async deleteTask(id: string): Promise<void> {
    try {
      await apiService.auth.delete<void>(`/communication-service/api/v1/tasks/${id}`);
    } catch (error) {
      console.error("Error deleting Task:", error);
      throw error;
    }
  }

  // Get a specific Task by its ID
  async getTask(id: string): Promise<Task> {
    try {
      const response = await apiService.auth.get<Task>(`/communication-service/api/v1/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Task by ID:", error);
      throw error;
    }
  }

  // Get all Tasks
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await apiService.auth.get<Task[]>("/communication-service/api/v1/tasks");
      return response.data;
    } catch (error) {
      console.error("Error fetching all Tasks:", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
