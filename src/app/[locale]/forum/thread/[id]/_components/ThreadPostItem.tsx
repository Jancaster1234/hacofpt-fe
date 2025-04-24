// src/app/[locale]/forum/thread/[id]/_components/ThreadPostItem.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { ThreadPost } from "@/types/entities/threadPost";
import { threadPostService } from "@/services/threadPost.service";
import UserInfo from "./UserInfo";
import LikeButton from "./LikeButton";
import ReportButton from "./ReportButton";
import PostForm from "./PostForm";

interface ThreadPostItemProps {
  post: ThreadPost;
  onPostUpdated: (post: ThreadPost) => void;
  onPostDeleted: (postId: string) => void;
  refreshPosts: () => void;
}

export default function ThreadPostItem({
  post,
  onPostUpdated,
  onPostDeleted,
  refreshPosts,
}: ThreadPostItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPostOwner = user?.username === post.createdByUserName;

  const handleDelete = async () => {
    if (
      !isPostOwner ||
      !window.confirm("Are you sure you want to delete this post?")
    )
      return;

    setIsDeleting(true);
    setError(null);

    try {
      await threadPostService.deleteThreadPost(post.id);
      onPostDeleted(post.id);
    } catch (err: any) {
      setError(err.message || "Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Post Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        {post.createdByUserName && (
          <UserInfo
            username={post.createdByUserName}
            createdAt={post.createdAt}
          />
        )}
      </div>

      {/* Post Content */}
      <div className="p-6">
        {isEditing ? (
          <PostForm
            forumThreadId={post.forumThreadId || ""}
            onPostSaved={() => {
              refreshPosts();
              setIsEditing(false);
            }}
            postId={post.id}
            initialContent={post.content}
            onCancel={() => setIsEditing(false)}
            isEditing={true}
          />
        ) : (
          <div className="prose max-w-none">
            {post.isDeleted ? (
              <p className="italic text-gray-400">
                This post has been deleted.
              </p>
            ) : (
              <p className="text-gray-800 whitespace-pre-wrap">
                {post.content}
              </p>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}
      </div>

      {/* Post Actions */}
      {!post.isDeleted && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <LikeButton
              threadPostId={post.id}
              initialLikes={post.threadPostLikes}
            />

            <ReportButton threadPostId={post.id} />
          </div>
          {isPostOwner && !isEditing && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-600 hover:text-blue-600 flex items-center space-x-1 px-2 py-1 rounded"
                title="Edit post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit</span>
              </button>

              <button
                onClick={handleDelete}
                className="text-gray-600 hover:text-red-600 flex items-center space-x-1 px-2 py-1 rounded"
                title="Delete post"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <svg
                    className="animate-spin h-4 w-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                )}
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
