// src/app/[locale]/forum/thread/[id]/_components/ThreadPostItem.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { ThreadPost } from "@/types/entities/threadPost";
import { threadPostService } from "@/services/threadPost.service";
import { userService } from "@/services/user.service";
import UserInfo from "./UserInfo";
import LikeButton from "./LikeButton";
import ReportButton from "./ReportButton";
import PostForm from "./PostForm";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

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
  const [deletedByUsername, setDeletedByUsername] = useState<string | null>(
    null
  );
  const [isLoadingDeletedBy, setIsLoadingDeletedBy] = useState(false);
  const t = useTranslations("forum");
  const toast = useToast();

  const isPostOwner = user?.username === post.createdByUserName;

  // Fetch user who deleted the post if applicable
  useEffect(() => {
    const fetchDeletedByUser = async () => {
      if (post.isDeleted && post.deletedById) {
        setIsLoadingDeletedBy(true);
        try {
          const { data } = await userService.getUserById(post.deletedById);
          if (data && data.username) {
            setDeletedByUsername(data.username);
          }
        } catch (err) {
          console.error("Failed to fetch user who deleted the post:", err);
        } finally {
          setIsLoadingDeletedBy(false);
        }
      }
    };

    fetchDeletedByUser();
  }, [post.isDeleted, post.deletedById]);

  const handleDelete = async () => {
    if (!isPostOwner || !window.confirm(t("deleteConfirmation"))) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await threadPostService.deleteThreadPost(post.id);
      onPostDeleted(post.id);
      toast.success(response.message || t("postDeletedSuccess"));
    } catch (err: any) {
      const errorMessage = err.message || t("deletePostFailed");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      t("atTime") +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Determine if post was deleted due to moderation
  const wasDeletedDueToModeration =
    post.isDeleted &&
    deletedByUsername &&
    deletedByUsername !== post.createdByUserName;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/30 rounded-lg overflow-hidden transition-colors duration-200">
      {/* Post Header */}
      <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        {post.createdByUserName && (
          <UserInfo
            username={post.createdByUserName}
            createdAt={post.createdAt}
          />
        )}
      </div>

      {/* Post Content */}
      <div className="p-4 sm:p-6">
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
          <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
            {post.isDeleted ? (
              <div className="italic text-gray-500 dark:text-gray-400 border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2">
                {wasDeletedDueToModeration ? (
                  <>
                    <p className="mb-1 text-red-600 dark:text-red-400 font-medium">
                      {t("postRemovedViolation")}
                    </p>
                    <p className="text-xs sm:text-sm">
                      {isLoadingDeletedBy
                        ? t("loadingModerationDetails")
                        : t("removedByModerator", {
                            moderator: deletedByUsername,
                            date: formatDate(post.updatedAt),
                          })}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-1">{t("postDeleted")}</p>
                    {isLoadingDeletedBy ? (
                      <p className="text-xs sm:text-sm">
                        {t("loadingDeletionDetails")}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm">
                        {deletedByUsername
                          ? t("deletedByUser", {
                              user: deletedByUsername,
                              date: formatDate(post.updatedAt),
                            })
                          : t("deletedBySystem", {
                              date: formatDate(post.updatedAt),
                            })}
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                {post.content}
              </p>
            )}
            {error && (
              <p className="text-red-500 dark:text-red-400 mt-2 text-sm">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Post Actions */}
      {!post.isDeleted && (
        <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <LikeButton
              threadPostId={post.id}
              initialLikes={post.threadPostLikes}
            />

            <ReportButton
              threadPostId={post.id}
              postAuthor={post.createdByUserName}
            />
          </div>
          {isPostOwner && !isEditing && (
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1 px-2 py-1 rounded transition-colors duration-200 text-xs sm:text-sm"
                title={t("editPost")}
                aria-label={t("editPost")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sm:w-4 sm:h-4 w-3 h-3"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span className="hidden sm:inline">{t("edit")}</span>
              </button>

              <button
                onClick={handleDelete}
                className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 flex items-center space-x-1 px-2 py-1 rounded transition-colors duration-200 text-xs sm:text-sm"
                title={t("deletePost")}
                aria-label={t("deletePost")}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <LoadingSpinner
                    size="sm"
                    showText={false}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-4 sm:h-4 w-3 h-3"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                )}
                <span className="hidden sm:inline">{t("delete")}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
