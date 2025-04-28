// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/ResultTab.tsx
"use client";

import { useState, useEffect } from "react";
import { Submission } from "@/types/entities/submission";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";

interface ResultTabProps {
  roundId: string;
  roundTitle: string;
  submissions: Submission[];
}

export default function ResultTab({
  roundId,
  roundTitle,
  submissions,
}: ResultTabProps) {
  const t = useTranslations("results");
  const [totalScore, setTotalScore] = useState(0);
  const [results, setResults] = useState<
    { criteria: string; score: number; max: number }[]
  >([]);
  const [activeJudgeTab, setActiveJudgeTab] = useState<string>("");
  const [judgeCount, setJudgeCount] = useState(0);

  // Use API modal for any error handling
  const { showError } = useApiModal();

  // Find the submitted submission
  const existingSubmission = submissions.find(
    (sub) => sub.status === "SUBMITTED"
  );

  useEffect(() => {
    try {
      if (!submissions.length) return;

      // Extract judge submissions info
      const judgeSubmissions = submissions
        .flatMap((sub) => sub.judgeSubmissions || [])
        .filter(Boolean);

      setJudgeCount(judgeSubmissions.length);

      // Calculate total score
      let total = 0;
      judgeSubmissions.forEach((js) => {
        total += js.score || 0;
      });

      // Extract criteria details
      const extractedResults = submissions.flatMap(
        (submission) =>
          submission.judgeSubmissions?.flatMap(
            (judgeSubmission) =>
              judgeSubmission.judgeSubmissionDetails?.map((detail) => {
                return {
                  criteria: detail.roundMarkCriterion?.name || "",
                  score: detail.score,
                  max: detail.roundMarkCriterion?.maxScore || 0,
                };
              }) || []
          ) || []
      );

      setTotalScore(total);
      setResults(extractedResults);
    } catch (error) {
      showError(
        t("errorProcessingResults"),
        error instanceof Error ? error.message : t("failedToProcessResults")
      );
    }
  }, [submissions, showError, t]);

  // Set active judge tab when submission data loads
  useEffect(() => {
    if (existingSubmission?.judgeSubmissions?.length > 0) {
      setActiveJudgeTab(existingSubmission.judgeSubmissions[0].judge?.id || "");
    }
  }, [existingSubmission]);

  if (!submissions.length)
    return (
      <p className="text-gray-500 dark:text-gray-400 transition-colors">
        {t("noSubmissionsAvailable")}
      </p>
    );

  if (!existingSubmission)
    return (
      <p className="text-gray-500 dark:text-gray-400 transition-colors">
        {t("noSubmittedWorkFound")}
      </p>
    );

  if (!existingSubmission.judgeSubmissions?.length)
    return (
      <div className="space-y-4">
        <p className="text-gray-500 dark:text-gray-400 transition-colors">
          {t("submissionNotEvaluated")}
        </p>

        {/* Show submission info */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg transition-colors">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            {t("yourSubmission")}
          </h3>
          <p className="dark:text-gray-300">
            {t("submittedAt")}:{" "}
            {new Date(existingSubmission.submittedAt).toLocaleString()}
          </p>
          <p className="dark:text-gray-300">
            {t("createdBy")}: {existingSubmission.createdByUserName}
          </p>

          {/* Files */}
          {existingSubmission.fileUrls &&
            existingSubmission.fileUrls.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium mb-2 dark:text-gray-200">
                  {t("submittedFiles")}:
                </h4>
                <ul className="space-y-2">
                  {existingSubmission.fileUrls.map((file) => (
                    <li
                      key={file.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md transition-colors"
                    >
                      <div className="flex flex-col mb-2 sm:mb-0">
                        <span className="font-medium dark:text-white">
                          {file.fileName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({(file.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <a
                        href={file.fileUrl}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t("download")} ${file.fileName}`}
                      >
                        {t("download")}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    );

  return (
    <div className="transition-all">
      <h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">
        {t("resultsFor")} {roundTitle}
      </h2>

      {/* Submission Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 transition-colors">
        <h3 className="font-medium mb-2 dark:text-white">
          {t("submissionSummary")}
        </h3>
        <p className="dark:text-gray-300">
          {t("submittedBy")}: {existingSubmission.createdByUserName}
        </p>
        <p className="dark:text-gray-300">
          {t("submissionDate")}:{" "}
          {new Date(existingSubmission.submittedAt).toLocaleString()}
        </p>
        <p className="dark:text-gray-300">
          {t("finalScore")}: {existingSubmission.finalScore || t("pending")}
        </p>
        <p className="dark:text-gray-300">
          {t("evaluationStatus")}: {judgeCount}{" "}
          {judgeCount !== 1 ? t("judges") : t("judge")} {t("completed")}
        </p>
      </div>

      {/* Judge Evaluations Section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          {t("judgeEvaluations")}
        </h3>

        {/* Judge Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto transition-colors">
          {existingSubmission.judgeSubmissions.map((judgeSubmission) => (
            <button
              key={judgeSubmission.id}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                activeJudgeTab === judgeSubmission.judge?.id
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveJudgeTab(judgeSubmission.judge?.id || "")}
              aria-selected={activeJudgeTab === judgeSubmission.judge?.id}
              role="tab"
            >
              {judgeSubmission.judge?.firstName || ""}{" "}
              {judgeSubmission.judge?.lastName || ""}{" "}
              <span className="text-xs">
                ({judgeSubmission.score || 0} {t("pts")})
              </span>
            </button>
          ))}
        </div>

        {/* Judge Evaluation Details */}
        {existingSubmission.judgeSubmissions.map((judgeSubmission) => (
          <div
            key={judgeSubmission.id}
            className={`${activeJudgeTab === judgeSubmission.judge?.id ? "block" : "hidden"}`}
            role="tabpanel"
          >
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg transition-colors">
              {/* Judge info */}
              {judgeSubmission.judge && (
                <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <h4 className="font-medium dark:text-white">
                        {judgeSubmission.judge.firstName}{" "}
                        {judgeSubmission.judge.lastName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {judgeSubmission.judge.email}
                      </p>
                      {judgeSubmission.judge.university && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {judgeSubmission.judge.university}
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {judgeSubmission.score}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("overallScore")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* General feedback */}
              {judgeSubmission.note && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded transition-colors">
                  <h5 className="font-medium mb-1 dark:text-white">
                    {t("generalFeedback")}:
                  </h5>
                  <p className="text-gray-800 dark:text-gray-300">
                    {judgeSubmission.note}
                  </p>
                </div>
              )}

              {/* Detailed Criteria Scores */}
              <h4 className="mt-4 font-medium dark:text-white">
                {t("evaluationCriteria")}:
              </h4>
              <ul className="mt-2 space-y-2">
                {judgeSubmission.judgeSubmissionDetails?.map((detail) => (
                  <li
                    key={detail.id}
                    className="border-b dark:border-gray-700 pb-2 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <div className="mb-2 sm:mb-0">
                        <span className="font-medium dark:text-white">
                          {detail.roundMarkCriterion?.name}:
                        </span>
                        {detail.roundMarkCriterion?.note && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {detail.roundMarkCriterion.note}
                          </p>
                        )}
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {detail.score}/{detail.roundMarkCriterion?.maxScore}
                      </span>
                    </div>
                    {detail.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-gray-700 p-2 rounded transition-colors">
                        {detail.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Files Section */}
      {existingSubmission.fileUrls &&
        existingSubmission.fileUrls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">
              {t("submittedFiles")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {existingSubmission.fileUrls.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-md transition-colors"
                >
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <span className="font-medium dark:text-white">
                      {file.fileName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {file.fileType.toUpperCase()} •{" "}
                      {(file.fileSize / 1024).toFixed(1)} KB
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t("uploaded")}:{" "}
                      {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <a
                    href={file.fileUrl}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t("download")} ${file.fileName}`}
                  >
                    {t("download")}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Summary of results */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">
          {t("overallResultsSummary")}
        </h3>
        <p className="text-xl font-bold dark:text-white">
          {t("totalScore")}: {existingSubmission.finalScore}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t("basedOnEvaluations")} {judgeCount}{" "}
          {judgeCount !== 1 ? t("judges") : t("judge")}.
        </p>
      </div>
    </div>
  );
}
