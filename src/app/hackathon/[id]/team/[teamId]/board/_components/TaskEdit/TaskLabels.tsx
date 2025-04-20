// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskLabels.tsx
"use client";

import { useState } from "react";
import { BoardLabel } from "@/types/entities/boardLabel";
import { taskLabelService } from "@/services/taskLabel.service";

interface TaskLabelsProps {
  selectedLabels: BoardLabel[];
  availableLabels: BoardLabel[];
  onChange: (labels: BoardLabel[]) => void;
  taskId: string;
}

export default function TaskLabels({
  selectedLabels,
  availableLabels,
  onChange,
  taskId,
}: TaskLabelsProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [labels, setLabels] = useState<BoardLabel[]>(selectedLabels);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(
    "selectedLabels in src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskLabels.tsx",
    selectedLabels
  );
  console.log(
    "labels in src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskLabels.tsx",
    labels
  );

  const toggleLabel = async (label: BoardLabel) => {
    try {
      setIsUpdating(true);
      setError(null);

      const isSelected = labels.some((l) => l.id === label.id);

      if (isSelected) {
        // Find the taskLabel to delete
        const { data: taskLabels } =
          await taskLabelService.getTaskLabelsByTaskId(taskId);
        const taskLabelToDelete = taskLabels.find(
          (tl) => tl.boardLabel?.id === label.id
        );

        if (taskLabelToDelete) {
          await taskLabelService.deleteTaskLabel(taskLabelToDelete.id);
        }

        // Update local state
        const newLabels = labels.filter((l) => l.id !== label.id);
        setLabels(newLabels);
        onChange(newLabels);
      } else {
        // Add new label
        await taskLabelService.createTaskLabel({
          taskId,
          boardLabelId: label.id,
        });

        // Update local state
        const newLabels = [...labels, label];
        setLabels(newLabels);
        onChange(newLabels);
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
      {labels.length > 0 && !isSelecting && (
        <div className="flex flex-wrap mt-1 ml-7 gap-1">
          {labels.map((label) => (
            <div
              key={label.id}
              className="h-2 w-10 rounded"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      {/* Label selector */}
      {isSelecting && (
        <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="max-h-48 overflow-y-auto">
            {availableLabels.map((label) => {
              const isSelected = labels.some((l) => l.id === label.id);
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
