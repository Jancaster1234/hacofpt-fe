// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskDescription.tsx
"use client";

import { useState } from "react";

interface TaskDescriptionProps {
  description: string;
  onChange: (description: string) => void;
}

export default function TaskDescription({
  description,
  onChange,
}: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSave = () => {
    onChange(editedDescription);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="mr-2">📝</span>
        Description
      </h3>

      {isEditing ? (
        <div>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
            placeholder="Add a more detailed description..."
            autoFocus
          />
          <div className="mt-2 flex space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditedDescription(description);
                setIsEditing(false);
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-pointer min-h-[60px] p-2 rounded hover:bg-gray-100"
        >
          {description ? (
            <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
          ) : (
            <p className="text-gray-400 italic">
              Add a more detailed description...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
