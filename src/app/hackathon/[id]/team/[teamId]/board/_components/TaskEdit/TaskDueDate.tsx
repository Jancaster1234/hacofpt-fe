// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskDueDate.tsx
"use client";

import { format, isPast, parseISO } from "date-fns";
import { useState } from "react";

interface TaskDueDateProps {
  dueDate?: string;
  onChange: (dueDate?: string) => void;
}

export default function TaskDueDate({ dueDate, onChange }: TaskDueDateProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  // Format displayed date and time separately
  const formattedDate = dueDate ? format(parseISO(dueDate), "MMM d, yyyy") : "";
  const formattedTime = dueDate ? format(parseISO(dueDate), "h:mm a") : "";
  const isPastDue = dueDate && isPast(parseISO(dueDate));

  // Parse existing date and time values for form inputs
  const dateValue = dueDate ? dueDate.split("T")[0] : "";
  const timeValue = dueDate ? format(parseISO(dueDate), "HH:mm") : "12:00"; // Default to noon

  const handleDateTimeChange = (type: "date" | "time", value: string) => {
    if (type === "date" && !value) {
      // If date is cleared, remove the whole due date
      onChange(undefined);
      return;
    }

    // Create a base date to work with
    let selectedDate: Date;

    if (dueDate) {
      // Use existing date as base if available
      selectedDate = parseISO(dueDate);
    } else {
      // Otherwise create a new date
      selectedDate = new Date();
    }

    if (type === "date") {
      // Update just the date portion
      const newDate = new Date(value);
      selectedDate.setFullYear(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate()
      );
    } else if (type === "time") {
      // Parse time string (HH:MM) and update hours and minutes
      const [hours, minutes] = value.split(":").map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);
    }

    // Format to ISO string in the required format: YYYY-MM-DDTHH:MM:SS
    const formattedISODate = selectedDate.toISOString().split(".")[0];
    onChange(formattedISODate);
  };

  return (
    <div className="mt-2">
      <button
        className="w-full text-left text-sm py-1 px-2 text-gray-700 hover:bg-gray-200 rounded flex items-center"
        onClick={() => setIsSelecting(!isSelecting)}
      >
        <span className="mr-2">🗓️</span>
        <span>Due Date</span>
      </button>

      {isSelecting && (
        <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="mb-2">
            <label className="block text-xs text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => handleDateTimeChange("date", e.target.value)}
              className="w-full p-1 border border-gray-300 rounded text-sm"
            />
          </div>

          <div className="mb-2">
            <label className="block text-xs text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={timeValue}
              onChange={(e) => handleDateTimeChange("time", e.target.value)}
              className="w-full p-1 border border-gray-300 rounded text-sm"
              disabled={!dateValue} // Disable time if no date is selected
            />
          </div>

          <div className="mt-2 flex justify-between">
            <button
              onClick={() => onChange(undefined)}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Remove
            </button>
            <button
              onClick={() => setIsSelecting(false)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {dueDate && !isSelecting && (
        <div className="mt-1 ml-7 text-xs">
          <span className={isPastDue ? "text-red-500" : "text-gray-600"}>
            {formattedDate} at {formattedTime}
          </span>
        </div>
      )}
    </div>
  );
}
