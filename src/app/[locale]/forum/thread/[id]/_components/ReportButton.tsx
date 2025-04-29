// src/app/[locale]/forum/thread/[id]/_components/ReportButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { threadPostReportService } from "@/services/threadPostReport.service";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  ThreadPostReport,
  ThreadPostReportStatus,
} from "@/types/entities/threadPostReport";

interface ReportButtonProps {
  threadPostId: string;
  postAuthor?: string; // Add this prop to identify the post author
}

export default function ReportButton({
  threadPostId,
  postAuthor,
}: ReportButtonProps) {
  const { user } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userReport, setUserReport] = useState<ThreadPostReport | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const t = useTranslations("report");

  // Check if the current user is the author of the post
  const isOwnPost = user?.username === postAuthor;

  useEffect(() => {
    const checkUserReport = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response =
          await threadPostReportService.getReportsByThreadPostId(threadPostId);
        const foundReport = response.data.find(
          (report) => report.createdByUserName === user.username
        );
        setUserReport(foundReport || null);
      } catch (error) {
        console.error("Failed to check user reports:", error);
        // No toast here as this is background data initialization
      } finally {
        setLoading(false);
      }
    };

    checkUserReport();
  }, [threadPostId, user]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError(t("errors.reasonRequired"));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await threadPostReportService.createThreadPostReport({
        threadPostId,
        reason,
        status: "PENDING",
      });

      if (response.data) {
        setUserReport(response.data);
        setShowReportModal(false);
        setReason("");
        toast.success(t("success.reportSubmitted"));
      }
    } catch (err: any) {
      const errorMessage = err.message || t("errors.failedToSubmit");
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getReportStatusBadge = (status: ThreadPostReportStatus) => {
    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        text: "text-yellow-800 dark:text-yellow-400",
        label: t("status.pending"),
      },
      REVIEWED: {
        bg: "bg-blue-100 dark:bg-blue-900/50",
        text: "text-blue-800 dark:text-blue-400",
        label: t("status.reviewed"),
      },
      DISMISSED: {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-800 dark:text-gray-400",
        label: t("status.dismissed"),
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} transition-colors duration-300`}
      >
        {config.label}
      </span>
    );
  };

  // Don't show report button if user is not logged in
  if (!user) {
    return null;
  }

  // Don't show report button if this is the user's own post
  if (isOwnPost) {
    return null;
  }

  return (
    <>
      {loading ? (
        <div className="flex items-center h-6">
          <LoadingSpinner
            size="sm"
            className="text-gray-500 dark:text-gray-400"
            showText={false}
          />
        </div>
      ) : userReport ? (
        <div className="flex items-center space-x-2 transition-colors duration-300">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t("labels.reported")}
          </span>
          {getReportStatusBadge(userReport.status)}
        </div>
      ) : (
        <button
          onClick={() => setShowReportModal(true)}
          className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 
                   flex items-center space-x-1 transition-colors duration-300"
          title={t("buttons.reportTooltip")}
          aria-label={t("aria.reportPost")}
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
            className="sm:w-4 sm:h-4"
          >
            <path d="M4 4v16h16"></path>
            <path d="M4 20l16-16"></path>
          </svg>
          <span className="text-xs sm:text-sm">{t("buttons.report")}</span>
        </button>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md 
                         shadow-xl transition-colors duration-300 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("modal.title")}
            </h3>
            <form onSubmit={handleSubmitReport}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-gray-300 mb-2 text-sm"
                  htmlFor="reason"
                >
                  {t("modal.reasonLabel")}
                </label>
                <textarea
                  id="reason"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                           transition-colors duration-300"
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t("modal.reasonPlaceholder")}
                  required
                  aria-label={t("aria.reportReason")}
                ></textarea>
                {error && (
                  <p
                    className="text-red-600 dark:text-red-400 text-sm mt-1"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-700 dark:text-gray-300 
                           bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 
                           dark:hover:bg-gray-600 transition-colors duration-300 text-xs sm:text-sm"
                  disabled={submitting}
                  aria-label={t("aria.cancel")}
                >
                  {t("buttons.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-white bg-red-600 dark:bg-red-700 
                         rounded-md hover:bg-red-700 dark:hover:bg-red-600 
                         transition-colors duration-300 flex items-center justify-center
                         min-w-[80px] text-xs sm:text-sm"
                  disabled={submitting}
                  aria-label={t("aria.submitReport")}
                >
                  {submitting ? (
                    <LoadingSpinner
                      size="sm"
                      className="text-white"
                      showText={false}
                    />
                  ) : (
                    t("buttons.submitReport")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
