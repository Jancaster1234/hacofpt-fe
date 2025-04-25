// src/app/[locale]/forum/category/[id]/_components/ThreadsList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ForumThread } from "@/types/entities/forumThread";
import { forumThreadService } from "@/services/forumThread.service";
import { userService } from "@/services/user.service";
import { User } from "@/types/entities/user";
import { useAuth } from "@/hooks/useAuth_v0";
import ThreadActions from "./ThreadActions";

export function ThreadsList({ categoryId }: { categoryId: string }) {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [threadUsers, setThreadUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  // Fetch all threads for this category
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const { data } =
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
        setError("Failed to load threads. Please try again later.");
        console.error("Error loading threads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [categoryId]);

  // Handler for thread deletion
  const handleThreadDelete = async (threadId: string) => {
    try {
      await forumThreadService.deleteForumThread(threadId);
      // Remove thread from state after successful deletion
      setThreads(threads.filter((thread) => thread.id !== threadId));
    } catch (err) {
      console.error("Failed to delete thread:", err);
      alert("Failed to delete thread. Please try again.");
    }
  };

  // Handler for thread update (pin/lock status)
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

      const { data } = await forumThreadService.updateForumThread(threadId, {
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
        isAdmin, // Pass the isAdmin flag to the service
      });

      // Update thread in state after successful update
      setThreads(
        threads.map((thread) => (thread.id === threadId ? data : thread))
      );
    } catch (err) {
      console.error("Failed to update thread:", err);
      alert("Failed to update thread. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading threads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-gray-800">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No threads yet
          </h3>
          <p className="text-gray-500">
            Be the first to start a discussion in this category
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-200">
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
              className={`p-6 hover:bg-gray-50 transition duration-150 ${
                thread.isPinned ? "bg-amber-50" : ""
              }`}
            >
              <div className="flex justify-between">
                <div className="flex-grow">
                  <Link href={`/forum/thread/${thread.id}`} className="group">
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition">
                        {thread.title}
                      </h2>
                      <div className="flex space-x-2 ml-3">
                        {thread.isPinned && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Pinned
                          </span>
                        )}
                        {thread.isLocked && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <div className="flex-shrink-0 mr-1.5">
                        {threadUser?.avatarUrl ? (
                          <img
                            src={threadUser.avatarUrl}
                            alt={threadUser.username}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                            {thread.createdByUserName?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium">
                          {thread.createdByUserName || "Unknown User"}
                        </div>
                        {threadUser &&
                          threadUser.userRoles &&
                          threadUser.userRoles.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {threadUser.userRoles[0].role.name.replace(
                                "_",
                                " "
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
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

                <div className="flex items-center space-x-2">
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
                  <div className="text-gray-500">
                    <Link href={`/forum/thread/${thread.id}`}>
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
