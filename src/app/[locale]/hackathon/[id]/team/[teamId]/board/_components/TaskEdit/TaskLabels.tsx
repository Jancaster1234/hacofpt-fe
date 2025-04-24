// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskLabels.tsx
"use client";

import { useState } from "react";
import { BoardLabel } from "@/types/entities/boardLabel";
import { taskLabelService } from "@/services/taskLabel.service";
import { TaskLabel } from "@/types/entities/taskLabel";

interface TaskLabelsProps {
  taskLabels: TaskLabel[];
  availableLabels: BoardLabel[];
  onChange: (taskLabels: TaskLabel[]) => void;
  taskId: string;
}

export default function TaskLabels({
  taskLabels,
  availableLabels,
  onChange,
  taskId,
}: TaskLabelsProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a map of selected label IDs for quick lookup
  const selectedLabelIds = new Set(
    taskLabels.map((tl) => tl.boardLabel?.id).filter(Boolean)
  );

  const toggleLabel = async (label: BoardLabel) => {
    try {
      setIsUpdating(true);
      setError(null);

      const isSelected = selectedLabelIds.has(label.id);

      if (isSelected) {
        // Find the taskLabel to delete from our existing props
        const taskLabelToDelete = taskLabels.find(
          (tl) => tl.boardLabel?.id === label.id
        );

        if (taskLabelToDelete && taskLabelToDelete.id) {
          await taskLabelService.deleteTaskLabel(taskLabelToDelete.id);

          // Update parent state by filtering out the deleted label
          const updatedTaskLabels = taskLabels.filter(
            (tl) => tl.boardLabel?.id !== label.id
          );
          onChange(updatedTaskLabels);
        }
      } else {
        // Add new label
        const { data: newTaskLabel } = await taskLabelService.createTaskLabel({
          taskId,
          boardLabelId: label.id,
        });

        if (newTaskLabel) {
          // Make sure the new task label has the board label info
          newTaskLabel.boardLabel = label;

          // Update parent state by adding the new task label
          const updatedTaskLabels = [...taskLabels, newTaskLabel];
          onChange(updatedTaskLabels);
        }
      }
    } catch (err) {
      console.error("Error updating task label:", err);
      setError("Failed to update label");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <button
        className="w-full text-left text-sm py-1 px-2 text-gray-700 hover:bg-gray-200 rounded flex items-center"
        onClick={() => setIsSelecting(!isSelecting)}
        disabled={isUpdating}
      >
        <span className="mr-2">🏷️</span>
        <span>Labels</span>
      </button>

      {error && <div className="mt-1 ml-7 text-xs text-red-500">{error}</div>}

      {/* Display selected labels */}
      {taskLabels.length > 0 && !isSelecting && (
        <div className="flex flex-wrap mt-1 ml-7 gap-1">
          {taskLabels.map(
            (taskLabel) =>
              taskLabel.boardLabel && (
                <div
                  key={taskLabel.id}
                  className="h-2 w-10 rounded"
                  style={{ backgroundColor: taskLabel.boardLabel.color }}
                  title={taskLabel.boardLabel.name}
                />
              )
          )}
        </div>
      )}

      {/* Label selector */}
      {isSelecting && (
        <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="max-h-48 overflow-y-auto">
            {availableLabels.map((label) => {
              const isSelected = selectedLabelIds.has(label.id);
              return (
                <div
                  key={label.id}
                  className={`flex items-center mb-1 cursor-pointer hover:bg-gray-100 rounded p-1 ${
                    isUpdating ? "opacity-50" : ""
                  }`}
                  onClick={() => !isUpdating && toggleLabel(label)}
                >
                  <div
                    className="w-8 h-6 rounded mr-2"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-sm">{label.name}</span>
                  {isSelected && <span className="ml-auto">✓</span>}
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
