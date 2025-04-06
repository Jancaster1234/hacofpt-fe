import { apiService } from "@/services/apiService_v0";
import { BoardLabel } from "@/types/entities/boardLabel";  // Assuming BoardLabel is your entity

type BoardLabelPayload = {
    id?: string;
    name: string;
    color: string;
    boardId?: string;
  };

  
class BoardLabelService {
  
  // Create a new Board Label
  async createBoardLabel(data: BoardLabelPayload): Promise<BoardLabel> {
    try {
      const response = await apiService.auth.post<BoardLabel>("/api/v1/board-labels", data);
      return response.data;
    } catch (error) {
      console.error("Error creating board label:", error);
      throw error;
    }
  }

  // Update an existing Board Label
  async updateBoardLabel(id: string, data: BoardLabelPayload): Promise<BoardLabel> {
    try {
      const response = await apiService.auth.put<BoardLabel>(`/communication-service/api/v1/board-labels/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating board label:", error);
      throw error;
    }
  }

  // Get a specific Board Label by ID
  async getBoardLabel(id: string): Promise<BoardLabel> {
    try {
      const response = await apiService.auth.get<BoardLabel>(`/communication-service/api/v1/board-labels/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching board label by ID:", error);
      throw error;
    }
  }

  // Get all Board Labels
  async getAllBoardLabels(): Promise<BoardLabel[]> {
    try {
      const response = await apiService.auth.get<BoardLabel[]>("/communication-service/api/v1/board-labels");
      return response.data;
    } catch (error) {
      console.error("Error fetching all board labels:", error);
      throw error;
    }
  }

  // Delete a Board Label
  async deleteBoardLabel(id: string): Promise<void> {
    try {
      await apiService.auth.delete<void>(`/communication-service/api/v1/board-labels/${id}`);
    } catch (error) {
      console.error("Error deleting board label:", error);
      throw error;
    }
  }
}

export const boardLabelService = new BoardLabelService();
