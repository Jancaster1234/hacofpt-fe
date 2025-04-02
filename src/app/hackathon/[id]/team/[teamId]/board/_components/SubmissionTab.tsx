// src/app/hackathon/[id]/team/[teamId]/board/_components/SubmissionTab.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Submission } from "@/types/entities/submission";
import { submissionService } from "@/services/submission.service";
interface Props {
  round: string;
  roundId: string;
  teamId: string;
  submissions: Submission[];
  loading: boolean;
  roundStartTime: string;
  roundEndTime: string;
  onSubmissionComplete: (submission: Submission) => void;
}

export default function SubmissionTab({
  round,
  roundId,
  teamId,
  submissions,
  loading,
  roundStartTime,
  roundEndTime,
  onSubmissionComplete,
}: Props) {
  const [timeLeft, setTimeLeft] = useState("");
  const [roundStatus, setRoundStatus] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingSubmission = submissions.find(
    (sub) => sub.status === "SUBMITTED"
  );
  const isRoundActive = (): boolean => {
    const now = Date.now();
    const startTime = new Date(roundStartTime).getTime();
    const endTime = new Date(roundEndTime).getTime();
    return now >= startTime && now <= endTime;
  };

  useEffect(() => {
    const now = Date.now();
    const startTime = new Date(roundStartTime).getTime();
    const endTime = new Date(roundEndTime).getTime();

    if (now < startTime) {
      setRoundStatus(
        `Round starts at: ${new Date(roundStartTime).toLocaleString()}`
      );
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const distance = endTime - Date.now();

      if (distance < 0) {
        setTimeLeft("Deadline Passed");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [roundStartTime, roundEndTime]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    if (!selectedFiles.length) {
      alert("Please select at least one file to submit");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("roundId", roundId);
      formData.append("teamId", teamId);
      formData.append("status", "SUBMITTED");

      selectedFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      // Call API to upload submission
      const submission = await submissionService.createSubmissionWithFiles(
        selectedFiles,
        roundId,
        teamId,
        "SUBMITTED"
      );

      // Update UI with the response
      onSubmissionComplete(submission);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error submitting files:", error);
      alert("Failed to submit files. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate API call for submission
  const simulateSubmissionApi = (formData: FormData): Promise<Submission> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create mock file URLs from the selected files
        const mockFileUrls = Array.from(selectedFiles).map((file, index) => ({
          id: `file-${Date.now()}-${index}`,
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          fileType: file.type,
          fileSize: file.size,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        const mockSubmission: Submission = {
          id: `submission-${Date.now()}`,
          round: {
            id: roundId,
            roundTitle: round,
          },
          fileUrls: mockFileUrls,
          judgeSubmissions: existingSubmission?.judgeSubmissions || [],
          status: "SUBMITTED",
          submittedAt: new Date().toISOString(),
          finalScore: existingSubmission?.finalScore,
          createdByUserName: "Current User", // In a real app, this would come from auth context
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        resolve(mockSubmission);
      }, 1000);
    });
  };

  if (loading) return <p>Loading submission...</p>;

  return (
    <div>
      {roundStatus ? (
        <p className="text-blue-500 font-semibold">{roundStatus}</p>
      ) : (
        <>
          {existingSubmission ? (
            <div>
              <h2 className="text-lg font-semibold">
                Your team has submitted successfully
              </h2>
              <p className="mt-2 font-semibold">
                Your submission:{" "}
                <span className="font-bold">
                  {existingSubmission.createdByUserName}
                </span>
              </p>

              {/* Existing Submission Files */}
              <div className="mt-3">
                <h3 className="font-medium mb-2">Submitted Files:</h3>
                {existingSubmission.fileUrls.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
                  >
                    <p className="truncate">{file.fileName}</p>
                    <a
                      href={file.fileUrl}
                      className="text-blue-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>

              {/* Timer & Resubmit */}
              {isRoundActive() ? (
                <>
                  <p className="mt-4 text-red-600 font-bold text-lg">
                    Time left: {timeLeft}
                  </p>
                  <p className="text-lg font-bold">
                    Submit due date: {new Date(roundEndTime).toLocaleString()}
                  </p>

                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={handleFileSelect}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Resubmit"}
                  </button>
                </>
              ) : (
                <p className="mt-4 text-gray-600 font-bold">
                  {timeLeft === "Deadline Passed"
                    ? "Submission period has ended"
                    : `Submission due date: ${new Date(roundEndTime).toLocaleString()}`}
                </p>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Submit your work for {round}
              </h2>

              {/* File Selection UI */}
              <div className="mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />

                <button
                  onClick={handleFileSelect}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Select Files
                </button>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Selected Files:</h3>
                    <ul className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                {selectedFiles.length > 0 && (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>

              {/* Timer */}
              <p className="mt-6 text-red-600 font-bold text-lg">
                Time left: {timeLeft}
              </p>
              <p className="text-lg font-bold">
                Submit due date: {new Date(roundEndTime).toLocaleString()}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
