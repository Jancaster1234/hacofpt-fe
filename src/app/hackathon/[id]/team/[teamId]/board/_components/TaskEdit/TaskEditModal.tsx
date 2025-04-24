// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskEditModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/entities/task";
import TaskTitle from "./TaskTitle";
import TaskDescription from "./TaskDescription";
import TaskDueDate from "./TaskDueDate";
import TaskLabels from "./TaskLabels";
import TaskAssignees from "./TaskAssignees";
import TaskAttachments from "./TaskAttachments";
import TaskComments from "./TaskComments";
import { BoardLabel } from "@/types/entities/boardLabel";
import { User } from "@/types/entities/user";
import { useKanbanStore } from "@/store/kanbanStore";
import { taskService } from "@/services/task.service";
import { taskLabelService } from "@/services/taskLabel.service";
import { taskAssigneeService } from "@/services/taskAssignee.service";
import { taskCommentService } from "@/services/taskComment.service";
import { FileUrl } from "@/types/entities/fileUrl";
import { TaskComment } from "@/types/entities/taskComment";
import { fileUrlService } from "@/services/fileUrl.service";

interface TaskEditModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  boardLabels?: BoardLabel[];
  teamMembers?: User[];
}

export default function TaskEditModal({
  task,
  isOpen,
  onClose,
  boardLabels = [],
  teamMembers = [],
}: TaskEditModalProps) {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<TaskComment[]>(task.comments || []);
  const [files, setFiles] = useState<FileUrl[]>(task.fileUrls || []);
  const updateTask = useKanbanStore((state) => state.updateTask);
  const removeTask = useKanbanStore((state) => state.removeTask);

  // Fetch comments and files when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchComments();
      fetchFiles();
    }
  }, [isOpen, task.id]);

  // Handle escape key to close the modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const fetchComments = async () => {
    try {
      const { data } = await taskCommentService.getTaskCommentsByTaskId(
        task.id
      );
      if (data) {
        setComments(data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const fetchFiles = async () => {
    try {
      const { data } = await fileUrlService.getFileUrlsByTaskId(task.id);
      if (data) {
        setFiles(data);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  if (!isOpen) return null;

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Update task information (title, description, dueDate)
      const { data: updatedTaskData } = await taskService.updateTaskInformation(
        task.id,
        {
          title: updatedTask.title,
          description: updatedTask.description || "",
          boardListId: updatedTask.boardListId,
          dueDate: updatedTask.dueDate || "",
        }
      );

      if (updatedTaskData) {
        // Create a comprehensive task object with all updated data
        const completeUpdatedTask = {
          ...updatedTaskData,
          // Include all the additional data we're tracking
          taskLabels: updatedTask.taskLabels || [],
          assignees: updatedTask.assignees || [],
          comments: comments || [],
          fileUrls: files || [],
        };

        // Update the task in the store with ALL the data
        updateTask(completeUpdatedTask);
      }

      // Close the modal
      onClose();
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Error updating task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use the enhanced removeTask from the store
      const success = await removeTask(task.id);

      if (success) {
        // Close the modal
        onClose();
      } else {
        setError("Failed to delete task. Please try again.");
      }
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = (comment: TaskComment) => {
    // Check if this is a deleted comment (using the special flag from TaskComments)
    if ((comment as any)._isDeleted) {
      // Remove the comment from the local state
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== comment.id)
      );
    } else {
      // If it's a new or edited comment, add/update it in the state
      setComments((prevComments) => {
        // Check if this comment already exists (for editing)
        const existingIndex = prevComments.findIndex(
          (c) => c.id === comment.id
        );

        if (existingIndex >= 0) {
          // Update existing comment
          const updatedComments = [...prevComments];
          updatedComments[existingIndex] = comment;
          return updatedComments;
        } else {
          // Add new comment
          return [...prevComments, comment];
        }
      });
    }

    // Update the task in the store to reflect the comment change
    const updatedTaskWithComments = {
      ...updatedTask,
      comments: comments.filter((c) => c.id !== comment.id), // Remove if deleted
    };
    if (!(comment as any)._isDeleted) {
      // Add or update the comment
      const existingIndex = updatedTaskWithComments.comments?.findIndex(
        (c) => c.id === comment.id
      );
      if (existingIndex && existingIndex >= 0) {
        updatedTaskWithComments.comments[existingIndex] = comment;
      } else {
        updatedTaskWithComments.comments = [
          ...(updatedTaskWithComments.comments || []),
          comment,
        ];
      }
    }
    updateTask(updatedTaskWithComments);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((c) => c.id !== commentId)
    );
  };

  const handleAddFile = (file: FileUrl | FileUrl[]) => {
    if (Array.isArray(file)) {
      setFiles((prevFiles) => [...prevFiles, ...file]);
    } else {
      setFiles((prevFiles) => [...prevFiles, file]);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Add handlers for labels and assignees
  const handleLabelsChange = (labels: BoardLabel[]) => {
    setUpdatedTask({
      ...updatedTask,
      taskLabels: labels.map((label) => ({
        id: "", // This will be generated on the server
        taskId: task.id,
        boardLabelId: label.id,
        boardLabel: label,
      })),
    });
  };

  const handleAssigneesChange = (assignees: User[]) => {
    setUpdatedTask({
      ...updatedTask,
      assignees: assignees.map((user) => ({
        id: "", // This will be generated on the server
        taskId: task.id,
        userId: user.id,
        user: user,
      })),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-2 bg-red-50 text-red-600 text-sm border-b border-red-100">
            {error}
          </div>
        )}

        <div className="p-4">
          {/* Task Title */}
          <TaskTitle
            title={updatedTask.title}
            onChange={(title) => setUpdatedTask({ ...updatedTask, title })}
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              {/* Task Description */}
              <TaskDescription
                description={updatedTask.description || ""}
                onChange={(description) =>
                  setUpdatedTask({ ...updatedTask, description })
                }
              />

              {/* Task Attachments */}
              <TaskAttachments
                files={files}
                taskId={task.id}
                onAddFile={handleAddFile}
                onRemoveFile={handleRemoveFile}
                onError={handleError}
              />

              {/* Task Comments */}
              <TaskComments
                comments={comments}
                taskId={task.id}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onError={handleError}
              />
            </div>

            <div className="space-y-4">
              {/* Task Actions */}
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Add to card
                </h3>

                {/* Task Labels */}
                <TaskLabels
                  taskLabels={updatedTask.taskLabels || []}
                  availableLabels={boardLabels}
                  taskId={task.id}
                  onChange={(taskLabels) =>
                    setUpdatedTask({ ...updatedTask, taskLabels })
                  }
                />

                {/* Task Due Date */}
                <TaskDueDate
                  dueDate={updatedTask.dueDate}
                  onChange={(dueDate) =>
                    setUpdatedTask({ ...updatedTask, dueDate })
                  }
                />

                {/* Task Assignees */}
                <TaskAssignees
                  taskAssignees={updatedTask.assignees || []}
                  availableMembers={teamMembers}
                  taskId={task.id}
                  onChange={(assignees) =>
                    setUpdatedTask({ ...updatedTask, assignees })
                  }
                />
              </div>

              {/* Actions */}
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Actions
                </h3>
                <button
                  className="w-full text-left text-sm py-1 px-2 text-red-600 hover:bg-gray-200 rounded"
                  onClick={handleDeleteTask}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
