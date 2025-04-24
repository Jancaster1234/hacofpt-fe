// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskComments.tsx
"use client";

import { useState } from "react";
import { TaskComment } from "@/types/entities/taskComment";
import { formatDistance } from "date-fns";
import { taskCommentService } from "@/services/taskComment.service";
import { useAuth } from "@/hooks/useAuth_v0";

interface TaskCommentsProps {
  comments: TaskComment[];
  taskId: string;
  onAddComment?: (comment: TaskComment) => void;
  onDeleteComment?: (commentId: string) => void;
  onError?: (error: string) => void;
}

export default function TaskComments({
  comments,
  taskId,
  onAddComment,
  onDeleteComment,
  onError,
}: TaskCommentsProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data: createdComment } =
        await taskCommentService.createTaskComment({
          taskId,
          content: newComment.trim(),
        });

      if (createdComment && onAddComment) {
        onAddComment(createdComment);
      }

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      if (onError) onError("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: TaskComment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editCommentContent.trim() || isEditing) return;

    try {
      setIsEditing(true);

      const { data: updatedComment } =
        await taskCommentService.updateTaskComment(commentId, {
          taskId, // Pass the taskId as required by the service
          content: editCommentContent.trim(),
        });

      if (updatedComment) {
        // Update the comment in the local state
        const updatedComments = comments.map((c) =>
          c.id === commentId ? { ...c, content: editCommentContent.trim() } : c
        );

        // Update the parent component with the edited comment
        if (onAddComment && updatedComment) {
          onAddComment(updatedComment);
        }
      }

      setEditingCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
      if (onError) onError("Failed to update comment. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (
      !window.confirm("Are you sure you want to delete this comment?") ||
      isDeleting
    ) {
      return;
    }

    try {
      setIsDeleting(true);

      await taskCommentService.deleteTaskComment(commentId);

      // Use the dedicated onDeleteComment function if available
      if (onDeleteComment) {
        onDeleteComment(commentId);
      } else if (onAddComment) {
        // Fallback to the previous workaround if onDeleteComment isn't provided
        const deletedComment = comments.find((c) => c.id === commentId);
        if (deletedComment) {
          onAddComment({
            ...deletedComment,
            _isDeleted: true, // Special flag to signal deletion
          } as any);
        }
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (onError) onError("Failed to delete comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to check if current user is the comment creator by username
  const isCommentOwner = (comment: TaskComment): boolean => {
    // Compare the current user's username with the comment creator's username
    return user?.username === comment.createdByUserName;
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="mr-2">💬</span>
        Comments
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] text-sm"
          disabled={isSubmitting}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? "Adding..." : "Add Comment"}
          </button>
        </div>
      </form>

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-3 rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                {/* Use actual avatar and username if available */}
                <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                <span className="text-sm font-medium">
                  {comment.createdByUserName || "User"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                  {formatDistance(
                    new Date(comment.createdAt || ""),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </span>

                {/* Edit/Delete options for comment owner */}
                {isCommentOwner(comment) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-xs text-blue-500 hover:text-blue-700"
                      disabled={isEditing || isDeleting}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                      disabled={isEditing || isDeleting}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editingCommentId === comment.id ? (
              <div>
                <textarea
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[60px] text-sm mb-2"
                  disabled={isEditing}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                    disabled={isEditing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(comment.id)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={!editCommentContent.trim() || isEditing}
                  >
                    {isEditing ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-gray-500 italic text-center">
            No comments yet
          </p>
        )}
      </div>
    </div>
  );
}
