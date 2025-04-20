// src/app/hackathon/[id]/team/[teamId]/board/_components/KanbanTask.tsx
import { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isPast } from "date-fns";
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
  console.log(
    "🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹Task in kanban task:",
    task
  );
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isDraggingNow,
  } = useSortable({
    id: task.id,
    data: { task },
  });

  // Apply CSS transform from dnd-kit
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDraggingNow ? 0.5 : 1,
  };

  // Format date and check if past due
  const formattedDate = task.dueDate
    ? format(new Date(task.dueDate), "MMM d")
    : null;

  const isPastDue = task.dueDate && isPast(new Date(task.dueDate));

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
        {/* Rest of your component remains the same */}
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
        <div className="flex justify-between items-center text-sm text-gray-400">
          {/* Due Date */}
          {formattedDate && (
            <span
              className={`flex items-center gap-1 ${isPastDue ? "text-red-500" : ""}`}
            >
              <span>⏰</span>
              <span>{formattedDate}</span>
            </span>
          )}

          {/* Show attachments count if any */}
          {task.fileUrls && task.fileUrls.length > 0 && (
            <span className="flex items-center gap-1">
              <span>📎</span>
              <span>{task.fileUrls.length}</span>
            </span>
          )}

          {/* Show comments count if any */}
          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1">
              <span>💬</span>
              <span>{task.comments.length}</span>
            </span>
          )}
        </div>

        {/* Task Assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignees
              .slice(0, 3)
              .map(
                (assignee) =>
                  assignee.user && (
                    <img
                      key={assignee.id}
                      src={
                        assignee.user.avatarUrl ||
                        "https://via.placeholder.com/30"
                      }
                      alt={`${assignee.user.firstName} ${assignee.user.lastName}`}
                      className="w-6 h-6 rounded-full border-2 border-white"
                      title={`${assignee.user.firstName} ${assignee.user.lastName}`}
                    />
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
