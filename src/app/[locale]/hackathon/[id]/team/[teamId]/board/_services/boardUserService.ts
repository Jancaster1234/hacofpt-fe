// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_services/boardUserService.ts
import { BoardUser } from "@/types/entities/board";

// Mock API calls with simulated delays

/**
 * Create a new board user
 */
export const createBoardUser = async (data: {
  boardId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  isDeleted: boolean;
}): Promise<BoardUser> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a mock response
      const newBoardUser: BoardUser = {
        id: `bu_${Date.now()}`, // Generate unique ID
        boardId: data.boardId,
        userId: data.userId,
        role: data.role,
        isDeleted: data.isDeleted,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // For UI purposes, we simulate having the complete user object
        user: {
          id: data.userId,
          firstName: "New", // These would come from actual API
          lastName: "User",
          email: "user@example.com",
          username: "newuser",
          avatarUrl: "https://via.placeholder.com/40",
          status: "Active",
        },
      };

      resolve(newBoardUser);
    }, 500); // 500ms delay to simulate network
  });
};

/**
 * Update a board user
 */
export const updateBoardUser = async (
  boardUser: BoardUser
): Promise<BoardUser> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return updated object with new timestamp
      const updatedBoardUser = {
        ...boardUser,
        updatedAt: new Date().toISOString(),
      };

      resolve(updatedBoardUser);
    }, 500);
  });
};

/**
 * Delete a board user (soft delete)
 */
export const deleteBoardUser = async (boardUser: BoardUser): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real API, we'd update the record here
      resolve();
    }, 500);
  });
};
