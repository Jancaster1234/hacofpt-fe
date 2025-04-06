import { apiService } from "@/services/apiService_v0";
import { Board } from "@/types/entities/board";  // Assuming Board is your entity

type BoardPayload = {
    id?: string; 
    name: string;
    description?: string;
    teamId?: string;
    hackathonId?: string;
    ownerId?: string;
  };

class BoardService {

  // Create a new Board
  async createBoard(data: BoardPayload): Promise<Board> {
    try {
      const response = await apiService.auth.post<Board>("/communication-service/api/v1/boards", data);
      return response.data;
    } catch (error) {
      console.error("Error creating board:", error);
      throw error;
    }
  }

  // Update an existing Board
  async updateBoard(id: string, data: BoardPayload): Promise<Board> {
    try {
      const response = await apiService.auth.put<Board>(`/communication-service/api/v1/boards/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating board:", error);
      throw error;
    }
  }

  // Get all boards
  async getAllBoards(): Promise<Board[]> {
    try {
      const response = await apiService.auth.get<Board[]>("/communication-service/api/v1/boards");
      return response.data;
    } catch (error) {
      console.error("Error fetching all boards:", error);
      throw error;
    }
  }

  // Get a board by ID
  async getBoardById(id: string): Promise<Board> {
    try {
      const response = await apiService.auth.get<Board>(`/communication-service/api/v1/boards/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching board by ID:", error);
      throw error;
    }
  }

  // Delete a board
  async deleteBoard(id: string): Promise<void> {
    try {
      await apiService.auth.delete<void>(`/communication-service/api/v1/boards/${id}`);
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error;
    }
  }
}

export const boardService = new BoardService();
