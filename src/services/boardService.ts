// src/services/boardService.ts
import { Board } from "@/types/entities/board";
import { BoardList } from "@/types/entities/boardList";
import { BoardLabel } from "@/types/entities/boardLabel";
import { Task } from "@/types/entities/task";
import { taskService } from "@/services/task.service";
import { boardService as realBoardService } from "@/services/board.service";
import { boardListService } from "@/services/boardList.service";
import { boardLabelService } from "@/services/boardLabel.service";

type CreateTaskParams = {
  title: string;
  description?: string;
  boardListId: string;
  position: number;
  dueDate?: string;
};

type ApiResponse<T> = {
  data: T;
  message?: string;
};

export async function createTask(
  params: CreateTaskParams
): Promise<ApiResponse<Task>> {
  try {
    const response = await taskService.createTask({
      title: params.title,
      description: params.description || "",
      position: params.position,
      boardListId: params.boardListId,
      dueDate: params.dueDate || "",
    });

    if (!response || !response.data) {
      throw new Error("Failed to create task");
    }

    return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.error("API error creating task:", error);
    throw error;
  }
}

// Board API functions
export const updateBoard = async (
  boardId: string,
  data: {
    name: string;
    description: string;
    teamId?: string;
    hackathonId?: string;
    ownerId?: string;
  }
): Promise<ApiResponse<Board>> => {
  try {
    const response = await realBoardService.updateBoard(boardId, {
      name: data.name,
      description: data.description,
      teamId: data.teamId,
      hackathonId: data.hackathonId,
      ownerId: data.ownerId,
    });

    if (!response || !response.data) {
      throw new Error("Failed to update board");
    }

    return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.error("API error updating board:", error);
    throw error;
  }
};

// BoardList API functions
export const createBoardList = async (data: {
  name: string;
  boardId: string;
  position?: number;
}): Promise<ApiResponse<BoardList>> => {
  try {
    const response = await boardListService.createBoardList({
      name: data.name,
      position: data.position !== undefined ? data.position : 999,
      boardId: data.boardId,
    });

    if (!response || !response.data) {
      throw new Error("Failed to create board list");
    }

    return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.error("API error creating board list:", error);
    throw error;
  }
};

export const updateBoardList = async (
  boardListId: string,
  data: { name: string; position?: number; boardId: string }
): Promise<ApiResponse<BoardList>> => {
  try {
    const response = await boardListService.updateBoardList(boardListId, {
      name: data.name,
      position: data.position || 0,
      boardId: data.boardId,
    });

    if (!response || !response.data) {
      throw new Error("Failed to update board list");
    }

    return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.error("API error updating board list:", error);
    throw error;
  }
};

export const deleteBoardList = async (
  boardListId: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await boardListService.deleteBoardList(boardListId);
    return {
      data: true,
      message: response?.message || "Board list deleted successfully",
    };
  } catch (error) {
    console.error("API error deleting board list:", error);
    return {
      data: false,
      message:
        error instanceof Error ? error.message : "Failed to delete board list",
    };
  }
};

// Bulk update position for drag and drop
export const updateBoardListPositions = async (
  updates: { id: string; position: number }[]
): Promise<ApiResponse<boolean>> => {
  try {
    const response =
      await boardListService.bulkUpdateBoardListPositions(updates);
    return {
      data: true,
      message: response?.message || "Board list positions updated successfully",
    };
  } catch (error) {
    console.error("API error bulk updating board list positions:", error);
    return {
      data: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update board list positions",
    };
  }
};

// BoardLabel API functions
export const createBoardLabel = async (data: {
  name: string;
  color: string;
  boardId: string;
}): Promise<ApiResponse<BoardLabel>> => {
  try {
    const response = await boardLabelService.createBoardLabel({
      name: data.name,
      color: data.color,
      boardId: data.boardId,
    });

    if (!response || !response.data) {
      throw new Error("Failed to create board label");
    }

    return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.error("API error creating board label:", error);
    throw error;
  }
};

export const updateBoardLabel = async (
  boardLabelId: string,
  data: { name: string; color: string; boardId: string }
): Promise<ApiResponse<BoardLabel>> => {
  try {
    const response = await boardLabelService.updateBoardLabel(boardLabelId, {
      name: data.name,
      color: data.color,
      boardId: data.boardId,
    });

    if (!response || !response.data) {
      throw new Error("Failed to update board label");
    }

    return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    console.error("API error updating board label:", error);
    throw error;
  }
};

export const deleteBoardLabel = async (
  boardLabelId: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await boardLabelService.deleteBoardLabel(boardLabelId);
    return {
      data: true,
      message: response?.message || "Board label deleted successfully",
    };
  } catch (error) {
    console.error("API error deleting board label:", error);
    return {
      data: false,
      message:
        error instanceof Error ? error.message : "Failed to delete board label",
    };
  }
};

export const updateTaskPositions = async (
  updates: { id: string; boardListId: string; position: number }[]
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await taskService.bulkUpdateTaskPositions(updates);

    if (!response || !response.data) {
      throw new Error("Failed to update task positions");
    }

    return {
      data: true,
      message: response.message || "Task positions updated successfully",
    };
  } catch (error) {
    console.error("API error updating task positions:", error);
    return {
      data: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update task positions",
    };
  }
};
