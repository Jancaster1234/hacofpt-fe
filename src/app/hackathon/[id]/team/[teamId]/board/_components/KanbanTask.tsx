// src/app/hackathon/[id]/team/[teamId]/board/_components/KanbanTask.tsx
import { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isPast, parseISO } from "date-fns";
import Image from "next/image";
import TaskEditModal from "./TaskEdit/TaskEditModal";
import { Task } from "@/types/entities/task";
import { useKanbanStore } from "@/store/kanbanStore";

interface KanbanTaskProps {
  task: Task;
}

export default function KanbanTask({ task }: KanbanTaskProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isDragging = useRef(false);
  const clickStartPosition = useRef({ x: 0, y: 0 });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isDraggingNow,
  } = useSortable({
    id: `task-${task.id}`, // Add a prefix to distinguish it as a task
    data: {
      type: "task",
      task,
    },
  });

  // Apply CSS transform from dnd-kit
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDraggingNow ? 0.5 : 1,
  };

  // Format date and time
  const formatDueDate = () => {
    if (!task.dueDate) return null;

    const date = parseISO(task.dueDate);
    const formattedDate = format(date, "MMM d");
    const formattedTime = format(date, "h:mm a");
    return { formattedDate, formattedTime, isPastDue: isPast(date) };
  };

  const dueDate = formatDueDate();

  const board = useKanbanStore((state) => state.board);

  // Get board labels and team members for the TaskEditModal
  const boardLabels = board?.boardLabels || [];
  const teamMembers =
    board?.boardUsers?.map((bu) => bu.user).filter(Boolean) || [];

  // Handle mouse down to track if it's a potential drag
  const handleMouseDown = (e: React.MouseEvent) => {
    clickStartPosition.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
  };

  // Handle mouse move to detect dragging
  const handleMouseMove = () => {
    isDragging.current = true;
  };

  // Handle mouse up to determine if it was a click or drag
  const handleMouseUp = (e: React.MouseEvent) => {
    const deltaX = Math.abs(e.clientX - clickStartPosition.current.x);
    const deltaY = Math.abs(e.clientY - clickStartPosition.current.y);

    // If the mouse barely moved, consider it a click and not a drag
    if (!isDragging.current && deltaX < 5 && deltaY < 5) {
      setIsEditModalOpen(true);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="bg-white p-4 rounded-lg shadow-md cursor-pointer space-y-2"
        style={style}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Task Title */}
        <p className="font-medium">{task.title}</p>

        {/* Task Description (if available) */}
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Task Labels */}
        {task.taskLabels && task.taskLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.taskLabels.map(
              (taskLabel) =>
                taskLabel.boardLabel && (
                  <span
                    key={taskLabel.id}
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: taskLabel.boardLabel.color }}
                    title={taskLabel.boardLabel.name}
                  />
                )
            )}
          </div>
        )}

        {/* Task Meta */}
        <div className="flex flex-wrap gap-3 items-center text-sm text-gray-400">
          {/* Due Date with improved display */}
          {dueDate && (
            <div
              className={`flex items-center gap-1 ${dueDate.isPastDue ? "text-red-500" : ""}`}
              title={dueDate.isPastDue ? "Past Due" : "Due Date"}
            >
              <span>🗓️</span>
              <span>{dueDate.formattedDate}</span>
              <span className="text-xs">at {dueDate.formattedTime}</span>
            </div>
          )}

          {/* Show attachments count if any */}
          {task.fileUrls && task.fileUrls.length > 0 && (
            <span className="flex items-center gap-1" title="Attachments">
              <span>📎</span>
              <span>{task.fileUrls.length}</span>
            </span>
          )}

          {/* Show comments count if any */}
          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1" title="Comments">
              <span>💬</span>
              <span>{task.comments.length}</span>
            </span>
          )}
        </div>

        {/* Task Assignees using next/image */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignees.slice(0, 3).map(
              (assignee) =>
                assignee.user && (
                  <div
                    key={assignee.id}
                    className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                    title={`${assignee.user.firstName} ${assignee.user.lastName}`}
                  >
                    <Image
                      src={
                        assignee.user.avatarUrl ||
                        "https://via.placeholder.com/30"
                      }
                      alt={`${assignee.user.firstName} ${assignee.user.lastName}`}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                )
            )}
            {task.assignees.length > 3 && (
              <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full border-2 border-white text-xs">
                +{task.assignees.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Task Edit Modal */}
      {isEditModalOpen && (
        <TaskEditModal
          task={task}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          boardLabels={boardLabels}
          teamMembers={teamMembers}
        />
      )}
    </>
  );
}
