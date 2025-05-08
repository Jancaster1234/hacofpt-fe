// src/app/[locale]/forum/category/[id]/_components/CreateThreadModal.tsx
"use client";

import { useState } from "react";
import { forumThreadService } from "@/services/forumThread.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface CreateThreadModalProps {
  categoryId: string;
  onClose: () => void;
}

export default function CreateThreadModal({
  categoryId,
  onClose,
}: CreateThreadModalProps) {
  const [title, setTitle] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations("forum");
  const toast = useToast();

  const isAdmin = user?.userRoles?.some(
    (userRole) => userRole.role.name === "ADMIN"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(t("pleaseEnterThreadTitle"));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      toast.info(t("creatingThread"));

      const { data, message } = await forumThreadService.createForumThread({
        title: title.trim(),
        forumCategoryId: categoryId,
        isLocked: isAdmin ? isLocked : false,
        isPinned: isAdmin ? isPinned : false,
        isAdmin,
      });

      if (data && data.id) {
        toast.success(t("threadCreatedSuccessfully"));
        router.refresh();
        router.push(`/forum/thread/${data.id}`);
      } else {
        setError(t("failedToCreateThread"));
        toast.error(message || t("failedToCreateThread"));
      }
    } catch (err: any) {
      console.error("Error creating thread:", err);
      const errorMessage = err?.message || t("failedToCreateThread");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-4 sm:p-6 shadow-xl transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2
            id="modal-title"
            className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300"
          >
            {t("createNewThread")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300"
            aria-label={t("close")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm transition-colors duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="thread-title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
            >
              {t("threadTitle")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="thread-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-300"
              placeholder={t("enterThreadTitle")}
              disabled={isSubmitting}
              autoFocus
              aria-required="true"
            />
          </div>

          {isAdmin && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pin-thread"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 transition-colors duration-300"
                  aria-label={t("pinThisThread")}
                />
                <label
                  htmlFor="pin-thread"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  {t("pinThisThread")}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lock-thread"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 transition-colors duration-300"
                  aria-label={t("lockThisThread")}
                />
                <label
                  htmlFor="lock-thread"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  {t("lockThisThread")}
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
              disabled={isSubmitting}
              aria-label={t("cancel")}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 flex items-center justify-center min-w-[100px]"
              disabled={isSubmitting}
              aria-label={isSubmitting ? t("creating") : t("createThread")}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t("creating")}
                </>
              ) : (
                t("createThread")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
