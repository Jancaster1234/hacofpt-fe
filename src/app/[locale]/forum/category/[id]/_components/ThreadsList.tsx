// src/app/[locale]/forum/category/[id]/_components/ThreadsList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ForumThread } from "@/types/entities/forumThread";
import { forumThreadService } from "@/services/forumThread.service";
import { userService } from "@/services/user.service";
import { User } from "@/types/entities/user";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ThreadActions from "./ThreadActions";

export function ThreadsList({ categoryId }: { categoryId: string }) {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [threadUsers, setThreadUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const t = useTranslations("forum.threads");
  const toast = useToast();

  // Fetch all threads for this category
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const { data, message } =
          await forumThreadService.getForumThreadsByCategoryId(categoryId);
        setThreads(data);

        // Fetch user data for each thread creator
        const userMap = new Map<string, User>();

        await Promise.all(
          data.map(async (thread) => {
            if (
              thread.createdByUserName &&
              !userMap.has(thread.createdByUserName)
            ) {
              try {
                const { data: userData } = await userService.getUserByUsername(
                  thread.createdByUserName
                );
                if (userData) {
                  userMap.set(thread.createdByUserName, userData);
                }
              } catch (err) {
                console.error(
                  `Failed to fetch user data for ${thread.createdByUserName}`,
                  err
                );
              }
            }
          })
        );

        setThreadUsers(userMap);
      } catch (err) {
        setError(t("loadError"));
        console.error("Error loading threads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
    // Don't include toast in dependency array to avoid infinite loops
  }, [categoryId, t]);

  // Handler for thread deletion with toast notifications
  const handleThreadDelete = async (threadId: string) => {
    try {
      // Show loading state
      setLoading(true);
      const { message } = await forumThreadService.deleteForumThread(threadId);

      // Remove thread from state after successful deletion
      setThreads(threads.filter((thread) => thread.id !== threadId));

      // Show success toast
      toast.success(t("deleteSuccess"));
    } catch (err: any) {
      console.error("Failed to delete thread:", err);
      // Show error toast
      toast.error(err?.message || t("deleteError"));
    } finally {
      setLoading(false);
    }
  };

  // Handler for thread update (pin/lock status) with toast notifications
  const handleThreadUpdate = async (
    threadId: string,
    updates: { isPinned?: boolean; isLocked?: boolean }
  ) => {
    try {
      const threadToUpdate = threads.find((t) => t.id === threadId);
      if (!threadToUpdate) return;

      const isAdmin = currentUser?.userRoles?.some(
        (userRole) => userRole.role.name === "ADMIN"
      );

      // Show loading state
      setLoading(true);

      const { data, message } = await forumThreadService.updateForumThread(
        threadId,
        {
          title: threadToUpdate.title,
          forumCategoryId: categoryId,
          isLocked:
            updates.isLocked !== undefined
              ? updates.isLocked
              : threadToUpdate.isLocked,
          isPinned:
            updates.isPinned !== undefined
              ? updates.isPinned
              : threadToUpdate.isPinned,
          isAdmin,
        }
      );

      // Update thread in state after successful update
      setThreads(
        threads.map((thread) => (thread.id === threadId ? data : thread))
      );

      // Show success toast
      toast.success(t("updateSuccess"));
    } catch (err: any) {
      console.error("Failed to update thread:", err);
      // Show error toast
      toast.error(err?.message || t("updateError"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center transition-colors duration-300">
        <LoadingSpinner size="md" showText={true} />
        <p className="mt-4 text-gray-600 dark:text-gray-300">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center transition-colors duration-300">
        <div className="text-red-500 mb-2 text-2xl">⚠️</div>
        <p className="text-gray-800 dark:text-gray-200">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {t("tryAgain")}
        </button>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300 mb-4 transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:h-8 sm:w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 transition-colors duration-300">
            {t("noThreadsYet")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            {t("beFirstToStart")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-visible transition-colors duration-300">
      <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
        {threads.map((thread) => {
          const threadUser = thread.createdByUserName
            ? threadUsers.get(thread.createdByUserName)
            : undefined;

          const isOwner = currentUser?.username === thread.createdByUserName;
          const isAdmin = currentUser?.userRoles?.some(
            (userRole) => userRole.role.name === "ADMIN"
          );

          return (
            <div
              key={thread.id}
              className={`p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150 ${
                thread.isPinned ? "bg-amber-50 dark:bg-amber-900/20" : ""
              }`}
              style={{ position: "relative", overflow: "visible" }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div className="flex-grow mb-4 sm:mb-0">
                  <Link href={`/forum/thread/${thread.id}`} className="group">
                    <div className="flex flex-wrap items-center">
                      <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {thread.title}
                      </h2>
                      <div className="flex flex-wrap space-x-2 mt-2 sm:mt-0 sm:ml-3">
                        {thread.isPinned && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-800/60 text-amber-800 dark:text-amber-200 transition-colors duration-300">
                            {t("pinned")}
                          </span>
                        )}
                        {thread.isLocked && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-800/60 text-red-800 dark:text-red-200 transition-colors duration-300">
                            {t("locked")}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="mt-2 flex items-center space-x-4 flex-wrap">
                    <div className="flex items-center text-sm">
                      <div className="flex-shrink-0 mr-1.5 relative w-8 h-8">
                        {threadUser?.avatarUrl ? (
                          <Image
                            src={threadUser.avatarUrl}
                            alt={threadUser.username || t("unknownUser")}
                            fill
                            sizes="32px"
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-500 dark:text-indigo-300 transition-colors duration-300">
                            {thread.createdByUserName?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-gray-100 font-medium transition-colors duration-300">
                          {thread.createdByUserName || t("unknownUser")}
                        </div>
                        {threadUser &&
                          threadUser.userRoles &&
                          threadUser.userRoles.length > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                              {t(
                                `roles.${threadUser.userRoles[0].role.name.toLowerCase().replace("_", "")}`,
                                {
                                  defaultValue:
                                    threadUser.userRoles[0].role.name.replace(
                                      "_",
                                      " "
                                    ),
                                }
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      {thread.createdAt &&
                        new Date(thread.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center space-x-2 justify-end"
                  style={{ zIndex: 10 }}
                >
                  {(isOwner || isAdmin) && (
                    <ThreadActions
                      thread={thread}
                      isAdmin={isAdmin}
                      onDelete={() => handleThreadDelete(thread.id)}
                      onUpdate={(updates) =>
                        handleThreadUpdate(thread.id, updates)
                      }
                    />
                  )}
                  <div className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    <Link
                      href={`/forum/thread/${thread.id}`}
                      aria-label={t("viewThread")}
                    >
                      <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
