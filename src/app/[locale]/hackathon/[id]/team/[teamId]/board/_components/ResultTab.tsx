// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/ResultTab.tsx
"use client";

import { useState, useEffect } from "react";
import { Submission } from "@/types/entities/submission";
import { useApiModal } from "@/hooks/useApiModal";

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
        "Error processing results",
        error instanceof Error
          ? error.message
          : "Failed to process submission results"
      );
    }
  }, [submissions, showError]);

  // Set active judge tab when submission data loads
  useEffect(() => {
    if (existingSubmission?.judgeSubmissions?.length > 0) {
      setActiveJudgeTab(existingSubmission.judgeSubmissions[0].judge?.id || "");
    }
  }, [existingSubmission]);

  if (!submissions.length)
    return (
      <p className="text-gray-500">No submissions available for this round.</p>
    );

  if (!existingSubmission)
    return (
      <p className="text-gray-500">No submitted work found for evaluation.</p>
    );

  if (!existingSubmission.judgeSubmissions?.length)
    return (
      <div className="space-y-4">
        <p className="text-gray-500">
          Your submission has not been evaluated by judges yet.
        </p>

        {/* Show submission info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Your Submission</h3>
          <p>
            Submitted at:{" "}
            {new Date(existingSubmission.submittedAt).toLocaleString()}
          </p>
          <p>Created by: {existingSubmission.createdByUserName}</p>

          {/* Files */}
          {existingSubmission.fileUrls &&
            existingSubmission.fileUrls.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium mb-2">Submitted Files:</h4>
                <ul className="space-y-2">
                  {existingSubmission.fileUrls.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{file.fileName}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <a
                        href={file.fileUrl}
                        className="text-blue-500 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
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
    <div>
      <h2 className="text-lg font-semibold mb-4">Results for {roundTitle}</h2>

      {/* Submission Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Submission Summary</h3>
        <p>Submitted by: {existingSubmission.createdByUserName}</p>
        <p>
          Submission date:{" "}
          {new Date(existingSubmission.submittedAt).toLocaleString()}
        </p>
        <p>Final score: {existingSubmission.finalScore || "Pending"}</p>
        <p>
          Evaluation status: {judgeCount} judge{judgeCount !== 1 ? "s" : ""}{" "}
          completed
        </p>
      </div>

      {/* Judge Evaluations Section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-4">Judge Evaluations</h3>

        {/* Judge Tabs */}
        <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
          {existingSubmission.judgeSubmissions.map((judgeSubmission) => (
            <button
              key={judgeSubmission.id}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeJudgeTab === judgeSubmission.judge?.id
                  ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveJudgeTab(judgeSubmission.judge?.id || "")}
            >
              {judgeSubmission.judge?.firstName || ""}{" "}
              {judgeSubmission.judge?.lastName || ""}{" "}
              <span className="text-xs">
                ({judgeSubmission.score || 0} pts)
              </span>
            </button>
          ))}
        </div>

        {/* Judge Evaluation Details */}
        {existingSubmission.judgeSubmissions.map((judgeSubmission) => (
          <div
            key={judgeSubmission.id}
            className={`${activeJudgeTab === judgeSubmission.judge?.id ? "block" : "hidden"}`}
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              {/* Judge info */}
              {judgeSubmission.judge && (
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {judgeSubmission.judge.firstName}{" "}
                        {judgeSubmission.judge.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {judgeSubmission.judge.email}
                      </p>
                      {judgeSubmission.judge.university && (
                        <p className="text-sm text-gray-600">
                          {judgeSubmission.judge.university}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {judgeSubmission.score}
                      </p>
                      <p className="text-xs text-gray-500">Overall Score</p>
                    </div>
                  </div>
                </div>
              )}

              {/* General feedback */}
              {judgeSubmission.note && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <h5 className="font-medium mb-1">General Feedback:</h5>
                  <p className="text-gray-800">{judgeSubmission.note}</p>
                </div>
              )}

              {/* Detailed Criteria Scores */}
              <h4 className="mt-4 font-medium">Evaluation Criteria:</h4>
              <ul className="mt-2 space-y-2">
                {judgeSubmission.judgeSubmissionDetails?.map((detail) => (
                  <li key={detail.id} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">
                          {detail.roundMarkCriterion?.name}:
                        </span>
                        {detail.roundMarkCriterion?.note && (
                          <p className="text-xs text-gray-500">
                            {detail.roundMarkCriterion.note}
                          </p>
                        )}
                      </div>
                      <span className="text-blue-600 font-semibold">
                        {detail.score}/{detail.roundMarkCriterion?.maxScore}
                      </span>
                    </div>
                    {detail.note && (
                      <p className="text-sm text-gray-600 mt-1 bg-gray-100 p-2 rounded">
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
            <h3 className="text-lg font-semibold mb-3">Submitted Files</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {existingSubmission.fileUrls.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-md"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{file.fileName}</span>
                    <span className="text-xs text-gray-500">
                      {file.fileType.toUpperCase()} •{" "}
                      {(file.fileSize / 1024).toFixed(1)} KB
                    </span>
                    <span className="text-xs text-gray-500">
                      Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <a
                    href={file.fileUrl}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Summary of results */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Overall Results Summary</h3>
        <p className="text-xl font-bold">Total Score: {totalScore}</p>
        <p className="text-sm text-gray-600 mt-1">
          Based on evaluations from {judgeCount} judge
          {judgeCount !== 1 ? "s" : ""}.
        </p>
      </div>
    </div>
  );
}
