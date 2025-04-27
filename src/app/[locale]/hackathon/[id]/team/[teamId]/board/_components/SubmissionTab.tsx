import { useState, useEffect, useRef } from "react";
import { Submission } from "@/types/entities/submission";
import { submissionService } from "@/services/submission.service";
import { useApiModal } from "@/hooks/useApiModal";

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
  const [isResubmitting, setIsResubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the API modal hook for error handling
  const { showSuccess, showError } = useApiModal();

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

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format the time display to include days if applicable
      if (days > 0) {
        setTimeLeft(
          `${days}d ${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roundStartTime, roundEndTime]);

  const handleFileSelect = () => {
    // Set resubmitting state to true when starting the resubmit process
    if (existingSubmission) {
      setIsResubmitting(true);
    }

    // Reset selected files when starting a new selection
    setSelectedFiles([]);

    // Trigger the file input click
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(newFiles); // Replace with new files instead of appending

      // Reset the file input value so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    if (!selectedFiles.length) {
      showError(
        "Submission Error",
        "Please select at least one file to submit"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Use the real service call
      let response;

      if (existingSubmission) {
        // Update existing submission
        response = await submissionService.updateSubmissionWithFiles(
          existingSubmission.id,
          selectedFiles,
          roundId,
          teamId,
          "SUBMITTED"
        );
      } else {
        // Create new submission
        response = await submissionService.createSubmissionWithFiles(
          selectedFiles,
          roundId,
          teamId,
          "SUBMITTED"
        );
      }

      if (response.data && response.data.id) {
        // Success - update UI with response
        onSubmissionComplete(response.data);
        setSelectedFiles([]);
        setIsResubmitting(false); // Reset resubmitting state

        showSuccess(
          "Submission Successful",
          existingSubmission
            ? "Your submission has been updated."
            : "Your work has been submitted successfully."
        );
      } else {
        throw new Error(
          response.message || "Failed to submit. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting files:", error);
      showError(
        "Submission Failed",
        error instanceof Error
          ? error.message
          : "An unknown error occurred while submitting your work."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel resubmission process and go back to showing existing submission
  const cancelResubmit = () => {
    setIsResubmitting(false);
    setSelectedFiles([]);
  };

  if (loading) return <p>Loading submission...</p>;

  return (
    <div>
      {roundStatus ? (
        <p className="text-blue-500 font-semibold">{roundStatus}</p>
      ) : (
        <>
          {existingSubmission && !isResubmitting ? (
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
                {isResubmitting
                  ? `Resubmit your work for ${round}`
                  : `Submit your work for ${round}`}
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

                {/* Submit Buttons */}
                <div className="mt-4 flex space-x-4">
                  {isResubmitting && (
                    <button
                      onClick={cancelResubmit}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {selectedFiles.length > 0 && (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : isResubmitting
                          ? "Resubmit"
                          : "Submit"}
                    </button>
                  )}
                </div>
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
