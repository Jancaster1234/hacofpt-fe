// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskTitle.tsx
"use client";

import { useState } from "react";

interface TaskTitleProps {
  title: string;
  onChange: (title: string) => void;
}

export default function TaskTitle({ title, onChange }: TaskTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onChange(editedTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="mb-4">
      {isEditing ? (
        <div className="mb-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            autoFocus
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditedTitle(title);
                setIsEditing(false);
              }
            }}
          />
        </div>
      ) : (
        <h3
          className="text-xl font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded"
          onClick={() => setIsEditing(true)}
        >
          {title}
        </h3>
      )}
      <div className="text-xs text-gray-500">
        in list <span className="underline">Doing</span>
      </div>
    </div>
  );
}
