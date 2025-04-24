// src/app/hackathon/[id]/team/[teamId]/board/_components/BoardHeader.tsx
"use client";

import { useState, useEffect } from "react";
import { Board } from "@/types/entities/board";
import { BoardLabel } from "@/types/entities/boardLabel";
import { useKanbanStore } from "@/store/kanbanStore";

interface BoardHeaderProps {
  board: Board;
  isOwner: boolean;
  onOpenUserManagement: () => void;
  onEdit: () => void;
}

export default function BoardHeader({
  board: initialBoard,
  isOwner,
  onOpenUserManagement,
  onEdit,
}: BoardHeaderProps) {
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  // Get the board from kanban store instead of using the prop directly
  const storeBoard = useKanbanStore((state) => state.board);

  // Use the store's board if available, otherwise fall back to the prop
  const board = storeBoard || initialBoard;

  useEffect(() => {
    // Update any local state when board details change
    // For example, if you have any local state derived from board name/description
  }, [board.name, board.description]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">{board.name}</h1>
          {isOwner && (
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-gray-700"
              title="Edit Board"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>

        <p className="text-gray-600 mt-1">{board.description}</p>
      </div>

      <div className="flex items-center mt-4 md:mt-0">
        {/* Avatars */}
        <div className="flex -space-x-2 mr-4">
          {board.boardUsers
            ?.filter((bu) => !bu.isDeleted)
            .slice(0, 3)
            .map((boardUser) => (
              <div
                key={boardUser.id}
                className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm font-medium"
                title={boardUser.user?.name || "User"}
              >
                {boardUser.user?.name?.charAt(0) || "U"}
              </div>
            ))}
          {(board.boardUsers?.filter((bu) => !bu.isDeleted).length || 0) >
            3 && (
            <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
              +
              {(board.boardUsers?.filter((bu) => !bu.isDeleted).length || 0) -
                3}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          {/* Label Management Button */}
          <button
            onClick={() => setIsLabelModalOpen(true)}
            className="flex items-center px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-md text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Manage Labels
          </button>

          {/* Manage Users Button */}
          <button
            onClick={onOpenUserManagement}
            className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Manage Users
          </button>
        </div>
      </div>

      {/* Label Management Modal */}
      {isLabelModalOpen && (
        <BoardLabelManagement
          board={board}
          isOpen={isLabelModalOpen}
          onClose={() => setIsLabelModalOpen(false)}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}

interface BoardLabelManagementProps {
  board: Board;
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
}

function BoardLabelManagement({
  board,
  isOpen,
  onClose,
  isOwner,
}: BoardLabelManagementProps) {
  const [labels, setLabels] = useState<BoardLabel[]>(board.boardLabels || []);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3b82f6"); // Default blue color
  const [editingLabel, setEditingLabel] = useState<BoardLabel | null>(null);
  const { createLabel, updateLabel, deleteLabel } = useKanbanStore();
  const [isLoading, setIsLoading] = useState(false);

  // Color options for labels
  const colorOptions = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#f59e0b" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Gray", value: "#6b7280" },
  ];

  const handleAddLabel = async () => {
    if (!newLabelName.trim()) return;
    setIsLoading(true);

    try {
      // Make sure the board ID is passed to the createLabel function
      const newLabel = await createLabel(newLabelName, newLabelColor);
      if (newLabel) {
        setLabels([...labels, newLabel]);
        setNewLabelName("");
      }
    } catch (error) {
      console.error("Error adding label:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLabel = async () => {
    if (!editingLabel || !newLabelName.trim()) return;
    setIsLoading(true);

    try {
      const updatedLabel = await updateLabel(
        editingLabel.id,
        newLabelName,
        newLabelColor
      );
      if (updatedLabel) {
        setLabels(
          labels.map((label) =>
            label.id === editingLabel.id
              ? { ...label, name: newLabelName, color: newLabelColor }
              : label
          )
        );
        setEditingLabel(null);
        setNewLabelName("");
        setNewLabelColor(colorOptions[0].value);
      }
    } catch (error) {
      console.error("Error updating label:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    if (!confirm("Are you sure you want to delete this label?")) return;
    setIsLoading(true);

    try {
      const success = await deleteLabel(labelId);
      if (success) {
        setLabels(labels.filter((label) => label.id !== labelId));
      }
    } catch (error) {
      console.error("Error deleting label:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditLabel = (label: BoardLabel) => {
    setEditingLabel(label);
    setNewLabelName(label.name);
    setNewLabelColor(label.color);
  };

  const cancelEdit = () => {
    setEditingLabel(null);
    setNewLabelName("");
    setNewLabelColor(colorOptions[0].value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Board Labels</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Label Form */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="mb-3">
            <label
              htmlFor="labelName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {editingLabel ? "Update Label" : "Add New Label"}
            </label>
            <input
              id="labelName"
              type="text"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="Label name"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setNewLabelColor(color.value)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    newLabelColor === color.value
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  disabled={isLoading}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            {editingLabel ? (
              <>
                <button
                  onClick={handleUpdateLabel}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md flex-1 disabled:bg-blue-300"
                  disabled={!isOwner || isLoading || !newLabelName.trim()}
                >
                  {isLoading ? "Updating..." : "Update Label"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddLabel}
                className="px-4 py-2 bg-blue-500 text-white rounded-md w-full disabled:bg-blue-300"
                disabled={!isOwner || !newLabelName.trim() || isLoading}
              >
                {isLoading ? "Adding..." : "Add Label"}
              </button>
            )}
          </div>
        </div>

        {/* Labels List */}
        <div className="max-h-64 overflow-y-auto">
          <h3 className="font-medium text-gray-700 mb-2">Current Labels</h3>
          {labels.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No labels available</p>
          ) : (
            <ul className="space-y-2">
              {labels.map((label) => (
                <li
                  key={label.id}
                  className="p-2 bg-white border border-gray-200 rounded-md flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div
                      className="h-4 w-4 rounded-full mr-2"
                      style={{ backgroundColor: label.color }}
                    ></div>
                    <span>{label.name}</span>
                  </div>
                  {isOwner && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEditLabel(label)}
                        className="text-gray-500 hover:text-blue-500"
                        disabled={isLoading}
                        aria-label="Edit label"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteLabel(label.id)}
                        className="text-gray-500 hover:text-red-500"
                        disabled={isLoading}
                        aria-label="Delete label"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
