// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskAssignees.tsx
"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/entities/user";
import { taskAssigneeService } from "@/services/taskAssignee.service";

interface TaskAssigneesProps {
  assignees: User[];
  availableMembers: User[];
  onChange: (assignees: User[]) => void;
  taskId: string;
}

export default function TaskAssignees({
  assignees,
  availableMembers,
  onChange,
  taskId,
}: TaskAssigneesProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentAssignees, setCurrentAssignees] = useState<User[]>(assignees);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAssignee = async (user: User) => {
    try {
      setIsUpdating(true);
      setError(null);

      const isAssigned = currentAssignees.some((a) => a.id === user.id);

      if (isAssigned) {
        // Find the taskAssignee to delete
        const { data: taskAssignees } =
          await taskAssigneeService.getTaskAssigneesByTaskId(taskId);
        const assigneeToDelete = taskAssignees.find(
          (ta) => ta.user?.id === user.id
        );

        if (assigneeToDelete) {
          await taskAssigneeService.deleteTaskAssignee(assigneeToDelete.id);
        }

        // Update local state
        const newAssignees = currentAssignees.filter((a) => a.id !== user.id);
        setCurrentAssignees(newAssignees);
        onChange(newAssignees);
      } else {
        // Add new assignee
        await taskAssigneeService.createTaskAssignee({
          taskId,
          userId: user.id,
        });

        // Update local state
        const newAssignees = [...currentAssignees, user];
        setCurrentAssignees(newAssignees);
        onChange(newAssignees);
      }
    } catch (err) {
      console.error("Error updating task assignee:", err);
      setError("Failed to update assignee");
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
      {currentAssignees.length > 0 && !isSelecting && (
        <div className="flex flex-wrap mt-1 ml-7 gap-1">
          {currentAssignees.map((user) => (
            <img
              key={user.id}
              src={user.avatarUrl || "https://via.placeholder.com/30"}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-6 h-6 rounded-full border border-white"
              title={`${user.firstName} ${user.lastName}`}
            />
          ))}
        </div>
      )}

      {/* Member selector */}
      {isSelecting && (
        <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="max-h-48 overflow-y-auto">
            {availableMembers.map((user) => {
              const isAssigned = currentAssignees.some((a) => a.id === user.id);
              return (
                <div
                  key={user.id}
                  className={`flex items-center mb-1 cursor-pointer hover:bg-gray-100 rounded p-1 ${
                    isUpdating ? "opacity-50" : ""
                  }`}
                  onClick={() => !isUpdating && toggleAssignee(user)}
                >
                  <img
                    src={user.avatarUrl || "https://via.placeholder.com/30"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-6 h-6 rounded-full mr-2"
                  />
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
