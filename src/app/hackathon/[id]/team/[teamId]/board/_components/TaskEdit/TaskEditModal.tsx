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
import { TaskLabel } from "@/types/entities/taskLabel";
import { TaskAssignee } from "@/types/entities/taskAssignee";

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

  // Sync the store on any change to task data
  useEffect(() => {
    if (isOpen) {
      // Create a comprehensive updated task object
      const completeUpdatedTask = {
        ...updatedTask,
        comments: comments || [],
        fileUrls: files || [],
      };

      // Update the store with the latest data without triggering API calls
      // This ensures the UI is always in sync with the state
      updateTask(completeUpdatedTask);
    }
  }, [updatedTask, comments, files]);

  const fetchComments = async () => {
    try {
      const { data } = await taskCommentService.getTaskCommentsByTaskId(
        task.id
      );
      if (data) {
        setComments(data);

        // Update the task in the store with the fetched comments
        const updatedTaskWithComments = {
          ...updatedTask,
          comments: data,
        };
        updateTask(updatedTaskWithComments);
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

        // Update the task in the store with the fetched files
        const updatedTaskWithFiles = {
          ...updatedTask,
          fileUrls: data,
        };
        updateTask(updatedTaskWithFiles);
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
      const updatedComments = comments.filter((c) => c.id !== comment.id);
      setComments(updatedComments);

      // Update the task in the store to reflect the comment change
      const updatedTaskWithComments = {
        ...updatedTask,
        comments: updatedComments,
      };
      updateTask(updatedTaskWithComments);
    } else {
      // If it's a new or edited comment, add/update it in the state
      const existingIndex = comments.findIndex((c) => c.id === comment.id);
      let updatedComments;

      if (existingIndex >= 0) {
        // Update existing comment
        updatedComments = [...comments];
        updatedComments[existingIndex] = comment;
      } else {
        // Add new comment
        updatedComments = [...comments, comment];
      }

      setComments(updatedComments);

      // Update the task in the store with the new comments
      const updatedTaskWithComments = {
        ...updatedTask,
        comments: updatedComments,
      };
      updateTask(updatedTaskWithComments);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);

    // Update the task in the store
    const updatedTaskWithComments = {
      ...updatedTask,
      comments: updatedComments,
    };
    updateTask(updatedTaskWithComments);
  };

  const handleAddFile = (file: FileUrl | FileUrl[]) => {
    let updatedFiles;

    if (Array.isArray(file)) {
      updatedFiles = [...files, ...file];
    } else {
      updatedFiles = [...files, file];
    }

    setFiles(updatedFiles);

    // Update the task in the store
    const updatedTaskWithFiles = {
      ...updatedTask,
      fileUrls: updatedFiles,
    };
    updateTask(updatedTaskWithFiles);
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId);
    setFiles(updatedFiles);

    // Update the task in the store
    const updatedTaskWithFiles = {
      ...updatedTask,
      fileUrls: updatedFiles,
    };
    updateTask(updatedTaskWithFiles);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Add handlers for labels and assignees
  const handleLabelsChange = (taskLabels: TaskLabel[]) => {
    // Update local state
    setUpdatedTask({
      ...updatedTask,
      taskLabels: taskLabels,
    });

    // Update the task in the store
    const updatedTaskWithLabels = {
      ...updatedTask,
      taskLabels: taskLabels,
      comments,
      fileUrls: files,
    };
    updateTask(updatedTaskWithLabels);
  };

  const handleAssigneesChange = (assignees: TaskAssignee[]) => {
    // Update local state
    setUpdatedTask({
      ...updatedTask,
      assignees: assignees,
    });

    // Update the task in the store
    const updatedTaskWithAssignees = {
      ...updatedTask,
      assignees: assignees,
      comments,
      fileUrls: files,
    };
    updateTask(updatedTaskWithAssignees);
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
            onChange={(title) => {
              const updated = { ...updatedTask, title };
              setUpdatedTask(updated);
              // Update the task in the store to reflect title change
              updateTask({
                ...updated,
                comments,
                fileUrls: files,
              });
            }}
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              {/* Task Description */}
              <TaskDescription
                description={updatedTask.description || ""}
                onChange={(description) => {
                  const updated = { ...updatedTask, description };
                  setUpdatedTask(updated);
                  // Update the task in the store to reflect description change
                  updateTask({
                    ...updated,
                    comments,
                    fileUrls: files,
                  });
                }}
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
                  onChange={handleLabelsChange}
                />

                {/* Task Due Date */}
                <TaskDueDate
                  dueDate={updatedTask.dueDate}
                  onChange={(dueDate) => {
                    const updated = { ...updatedTask, dueDate };
                    setUpdatedTask(updated);
                    // Update the task in the store to reflect due date change
                    updateTask({
                      ...updated,
                      comments,
                      fileUrls: files,
                    });
                  }}
                />

                {/* Task Assignees */}
                <TaskAssignees
                  taskAssignees={updatedTask.assignees || []}
                  availableMembers={teamMembers}
                  taskId={task.id}
                  onChange={handleAssigneesChange}
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
