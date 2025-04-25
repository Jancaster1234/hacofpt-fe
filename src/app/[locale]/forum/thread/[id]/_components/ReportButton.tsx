// src/app/[locale]/forum/thread/[id]/_components/ReportButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { threadPostReportService } from "@/services/threadPostReport.service";
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

  // Check if the current user is the author of the post
  const isOwnPost = user?.username === postAuthor;

  useEffect(() => {
    const checkUserReport = async () => {
      if (!user) return;

      try {
        const response =
          await threadPostReportService.getReportsByThreadPostId(threadPostId);
        const foundReport = response.data.find(
          (report) => report.createdByUserName === user.username
        );
        setUserReport(foundReport || null);
      } catch (error) {
        console.error("Failed to check user reports:", error);
      }
    };

    checkUserReport();
  }, [threadPostId, user]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for the report");
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
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getReportStatusBadge = (status: ThreadPostReportStatus) => {
    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending Review",
      },
      REVIEWED: { bg: "bg-blue-100", text: "text-blue-800", label: "Reviewed" },
      DISMISSED: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Dismissed",
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
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
      {userReport ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Reported</span>
          {getReportStatusBadge(userReport.status)}
        </div>
      ) : (
        <button
          onClick={() => setShowReportModal(true)}
          className="text-gray-600 hover:text-red-600 flex items-center space-x-1"
          title="Report this post"
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
            <path d="M4 4v16h16"></path>
            <path d="M4 20l16-16"></path>
          </svg>
          <span className="text-sm">Report</span>
        </button>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Report Post</h3>
            <form onSubmit={handleSubmitReport}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="reason">
                  Reason for reporting
                </label>
                <textarea
                  id="reason"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please explain why this post should be reported..."
                  required
                ></textarea>
                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center"
                  disabled={submitting}
                >
                  {submitting && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  )}
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
