// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskAssignees.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "@/types/entities/user";
import { taskAssigneeService } from "@/services/taskAssignee.service";
import { TaskAssignee } from "@/types/entities/taskAssignee";

interface TaskAssigneesProps {
  taskAssignees: TaskAssignee[];
  availableMembers: User[];
  onChange: (taskAssignees: TaskAssignee[]) => void;
  taskId: string;
}

export default function TaskAssignees({
  taskAssignees,
  availableMembers,
  onChange,
  taskId,
}: TaskAssigneesProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a map of assigned user IDs for quick lookup
  const assignedUserIds = new Set(
    taskAssignees.map((ta) => ta.user?.id).filter(Boolean)
  );

  const toggleAssignee = async (user: User) => {
    try {
      setIsUpdating(true);
      setError(null);

      const isAssigned = assignedUserIds.has(user.id);

      if (isAssigned) {
        // Find the taskAssignee to delete from our existing props
        const assigneeToDelete = taskAssignees.find(
          (ta) => ta.user?.id === user.id
        );

        if (assigneeToDelete && assigneeToDelete.id) {
          await taskAssigneeService.deleteTaskAssignee(assigneeToDelete.id);

          // Update parent state by filtering out the deleted assignee
          const updatedTaskAssignees = taskAssignees.filter(
            (ta) => ta.user?.id !== user.id
          );
          onChange(updatedTaskAssignees);
        }
      } else {
        // Add new assignee
        const { data: newTaskAssignee } =
          await taskAssigneeService.createTaskAssignee({
            taskId,
            userId: user.id,
          });

        if (newTaskAssignee) {
          // Make sure the new task assignee has the user info
          newTaskAssignee.user = user;

          // Update parent state by adding the new task assignee
          const updatedTaskAssignees = [...taskAssignees, newTaskAssignee];
          onChange(updatedTaskAssignees);
        }
      }
    } catch (err) {
      console.error("Error updating task assignee:", err);
      setError("Failed to update assignee");
    } finally {
      setIsUpdating(false);
    }
  };

  const removeAssignee = async (taskAssignee: TaskAssignee) => {
    try {
      setIsUpdating(true);
      setError(null);

      if (taskAssignee.id) {
        await taskAssigneeService.deleteTaskAssignee(taskAssignee.id);

        // Update parent state by filtering out the deleted assignee
        const updatedTaskAssignees = taskAssignees.filter(
          (ta) => ta.id !== taskAssignee.id
        );
        onChange(updatedTaskAssignees);
      }
    } catch (err) {
      console.error("Error removing task assignee:", err);
      setError("Failed to remove assignee");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        className="w-full text-left text-sm py-1 px-2 text-gray-700 hover:bg-gray-200 rounded flex items-center"
        onClick={() => setIsSelecting(!isSelecting)}
        disabled={isUpdating}
      >
        <span className="mr-2">👤</span>
        <span>Members</span>
      </button>

      {error && <div className="mt-1 ml-7 text-xs text-red-500">{error}</div>}

      {/* Display assigned members */}
      {taskAssignees.length > 0 && !isSelecting && (
        <div className="flex flex-wrap mt-1 ml-7 gap-2">
          {taskAssignees.map(
            (taskAssignee) =>
              taskAssignee.user && (
                <div key={taskAssignee.id} className="relative group">
                  <div className="relative w-6 h-6">
                    <Image
                      src={
                        taskAssignee.user.avatarUrl ||
                        "https://via.placeholder.com/30"
                      }
                      alt={`${taskAssignee.user.firstName} ${taskAssignee.user.lastName}`}
                      className="rounded-full border border-white"
                      title={`${taskAssignee.user.firstName} ${taskAssignee.user.lastName}`}
                      fill
                      sizes="24px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  {/* X button overlay that appears on hover */}
                  <button
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAssignee(taskAssignee);
                    }}
                    disabled={isUpdating}
                    title="Remove assignee"
                  >
                    ×
                  </button>
                </div>
              )
          )}
        </div>
      )}

      {/* Member selector */}
      {isSelecting && (
        <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="max-h-48 overflow-y-auto">
            {availableMembers.map((user) => {
              const isAssigned = assignedUserIds.has(user.id);
              return (
                <div
                  key={user.id}
                  className={`flex items-center mb-1 cursor-pointer hover:bg-gray-100 rounded p-1 ${
                    isUpdating ? "opacity-50" : ""
                  }`}
                  onClick={() => !isUpdating && toggleAssignee(user)}
                >
                  <div className="relative w-6 h-6 mr-2">
                    <Image
                      src={user.avatarUrl || "https://via.placeholder.com/30"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="rounded-full"
                      fill
                      sizes="24px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <span className="text-sm">{`${user.firstName} ${user.lastName}`}</span>
                  {isAssigned && <span className="ml-auto">✓</span>}
                </div>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setIsSelecting(false)}
              className="w-full text-center text-xs text-blue-600 hover:text-blue-800"
              disabled={isUpdating}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
