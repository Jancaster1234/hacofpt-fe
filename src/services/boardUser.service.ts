import { apiService } from "@/services/apiService_v0";
import { BoardUser } from "@/types/entities/boardUser";

type BoardUserPayload = {
  boardId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  isDeleted: boolean;
  deletedById?: string;
};

class BoardUserService {

  // Create a new BoardUser
  async createBoardUser(data: BoardUserPayload): Promise<BoardUser> {
    try {
      const response = await apiService.auth.post<BoardUser>("/communication-service/api/v1/board-users", data);
      return response.data;
    } catch (error) {
      console.error("Error creating BoardUser:", error);
      throw error;
    }
  }

  // Update an existing BoardUser
  async updateBoardUser(id: string, data: BoardUserPayload): Promise<BoardUser> {
    try {
      const response = await apiService.auth.put<BoardUser>(`/communication-service/api/v1/board-users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating BoardUser:", error);
      throw error;
    }
  }

  // Delete a BoardUser by its ID
  async deleteBoardUser(id: string): Promise<void> {
    try {
      await apiService.auth.delete<void>(`/communication-service/api/v1/board-users/${id}`);
    } catch (error) {
      console.error("Error deleting BoardUser:", error);
      throw error;
    }
  }

  // Get a specific BoardUser by its ID
  async getBoardUser(id: string): Promise<BoardUser> {
    try {
      const response = await apiService.auth.get<BoardUser>(`/communication-service/api/v1/board-users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching BoardUser by ID:", error);
      throw error;
    }
  }

  // Get all BoardUsers
  async getAllBoardUsers(): Promise<BoardUser[]> {
    try {
      const response = await apiService.auth.get<BoardUser[]>("/communication-service/api/v1/board-users");
      return response.data;
    } catch (error) {
      console.error("Error fetching all BoardUsers:", error);
      throw error;
    }
  }

  // Get all BoardUsers for a specific board
  async getBoardUsersByBoardId(boardId: string): Promise<BoardUser[]> {
    try {
      const response = await apiService.auth.get<BoardUser[]>(`/communication-service/api/v1/board-users/by-board/${boardId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching BoardUsers by Board ID:", error);
      throw error;
    }
  }

  // Get all BoardUsers for a specific user
  async getBoardUsersByUserId(userId: string): Promise<BoardUser[]> {
    try {
      const response = await apiService.auth.get<BoardUser[]>(`/communication-service/api/v1/board-users/by-user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching BoardUsers by User ID:", error);
      throw error;
    }
  }
}

export const boardUserService = new BoardUserService();
