import { apiService } from "@/services/apiService_v0";
import { BoardList } from "@/types/entities/boardList";

type BoardListPayload = {
    id?: string;
    name: string;
    position: number;
    boardId: string;
  };

class BoardListService {

  // Create a new Board List
  async createBoardList(data: BoardListPayload): Promise<BoardList> {
    try {
      const response = await apiService.auth.post<BoardList>("/communication-service/api/v1/board-lists", data);
      return response.data;
    } catch (error) {
      console.error("Error creating board list:", error);
      throw error;
    }
  }

  // Update an existing Board List
  async updateBoardList(id: string, data: BoardListPayload): Promise<BoardList> {
    try {
      const response = await apiService.auth.put<BoardList>(`/communication-service/api/v1/board-lists/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating board list:", error);
      throw error;
    }
  }

  // Get a specific Board List by ID
  async getBoardList(id: string): Promise<BoardList> {
    try {
      const response = await apiService.auth.get<BoardList>(`/communication-service/api/v1/board-lists/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching board list by ID:", error);
      throw error;
    }
  }

  // Get all Board Lists
  async getAllBoardLists(): Promise<BoardList[]> {
    try {
      const response = await apiService.auth.get<BoardList[]>("/communication-service/api/v1/board-lists");
      return response.data;
    } catch (error) {
      console.error("Error fetching all board lists:", error);
      throw error;
    }
  }

  // Delete a Board List
  async deleteBoardList(id: string): Promise<void> {
    try {
      await apiService.auth.delete<void>(`/communication-service/api/v1/board-lists/${id}`);
    } catch (error) {
      console.error("Error deleting board list:", error);
      throw error;
    }
  }
}

export const boardListService = new BoardListService();
