// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/SubmissionTab.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Submission } from "@/types/entities/submission";
import { submissionService } from "@/services/submission.service";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const t = useTranslations("submission");
  const toast = useToast();

  const [timeLeft, setTimeLeft] = useState("");
  const [roundStatus, setRoundStatus] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);

  // Use the API modal hook for error handling
  const { showSuccess, showError } = useApiModal();

  const existingSubmission = submissions.find(
    (sub) => sub.status === "SUBMITTED"
  );

  const isRoundActive = useCallback((): boolean => {
    const now = Date.now();
    const startTime = new Date(roundStartTime).getTime();
    const endTime = new Date(roundEndTime).getTime();
    return now >= startTime && now <= endTime;
  }, [roundStartTime, roundEndTime]);

  // Reset component state when roundId changes
  useEffect(() => {
    setSelectedFiles([]);
    setIsResubmitting(false);
  }, [roundId]);

  // Setup isMounted cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update round status and timer whenever round info changes
  useEffect(() => {
    const checkRoundStatus = () => {
      const now = Date.now();
      const startTime = new Date(roundStartTime).getTime();
      const endTime = new Date(roundEndTime).getTime();

      if (now < startTime) {
        setRoundStatus(
          t("roundStartsAt", {
            date: new Date(roundStartTime).toLocaleString(),
          })
        );
        setTimeLeft("");
        return;
      }

      setRoundStatus(""); // Clear round status when round is active or ended
    };

    checkRoundStatus();

    const interval = setInterval(() => {
      if (!isMounted.current) {
        clearInterval(interval);
        return;
      }

      const now = Date.now();
      const endTime = new Date(roundEndTime).getTime();
      const startTime = new Date(roundStartTime).getTime();

      // Re-check if round status changed
      if (now < startTime) {
        setRoundStatus(
          t("roundStartsAt", {
            date: new Date(roundStartTime).toLocaleString(),
          })
        );
        setTimeLeft("");
        clearInterval(interval);
        return;
      } else if (roundStatus) {
        // Clear round status if it was set but round has now started
        setRoundStatus("");
      }

      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft(t("deadlinePassed"));
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
          `${days}${t("daysShort")} ${hours.toString().padStart(2, "0")}:${minutes
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

    return () => {
      clearInterval(interval);
    };
  }, [roundStartTime, roundEndTime, roundStatus, t]);

  const handleFileSelect = useCallback(() => {
    // Set resubmitting state to true when starting the resubmit process
    if (existingSubmission) {
      setIsResubmitting(true);
    }

    // Reset selected files when starting a new selection
    setSelectedFiles([]);

    // Trigger the file input click
    fileInputRef.current?.click();
  }, [existingSubmission]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        setSelectedFiles(newFiles); // Replace with new files instead of appending

        // Reset the file input value so the same file can be selected again if needed
        e.target.value = "";
      }
    },
    []
  );

  const removeFile = useCallback((indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedFiles.length) {
      toast.error(t("selectFilesError"));
      showError(t("submissionError"), t("selectFilesError"));
      return;
    }

    try {
      setIsSubmitting(true);
      toast.info(t("submissionInProgress"));

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

      if (!isMounted.current) return;

      if (response.data && response.data.id) {
        // Success - update UI with response
        onSubmissionComplete(response.data);
        setSelectedFiles([]);
        setIsResubmitting(false); // Reset resubmitting state

        const successMessage = existingSubmission
          ? t("submissionUpdated")
          : t("submissionSuccessful");

        toast.success(response.message || successMessage);
        showSuccess(t("submissionSuccess"), response.message || successMessage);
      } else {
        throw new Error(response.message || t("submissionFailed"));
      }
    } catch (error) {
      console.error("Error submitting files:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("unknownSubmissionError");

      toast.error(errorMessage);
      showError(t("submissionFailed"), errorMessage);
    } finally {
      if (isMounted.current) {
        setIsSubmitting(false);
      }
    }
  }, [
    selectedFiles,
    existingSubmission,
    roundId,
    teamId,
    onSubmissionComplete,
    toast,
    showSuccess,
    showError,
    t,
  ]);

  // Cancel resubmission process and go back to showing existing submission
  const cancelResubmit = useCallback(() => {
    setIsResubmitting(false);
    setSelectedFiles([]);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 transition-all">
        <LoadingSpinner size="md" showText />
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300 dark:text-gray-200">
      {roundStatus ? (
        <p className="text-blue-500 dark:text-blue-400 font-semibold text-sm sm:text-base md:text-lg">
          {roundStatus}
        </p>
      ) : (
        <>
          {existingSubmission && !isResubmitting ? (
            <div className="space-y-4 transition-all">
              <h2 className="text-base sm:text-lg font-semibold dark:text-white">
                {t("teamSubmitted")}
              </h2>
              <p className="mt-2 font-semibold text-sm sm:text-base">
                {t("yourSubmission")}:{" "}
                <span className="font-bold">
                  {existingSubmission.createdByUserName}
                </span>
              </p>

              {/* Existing Submission Files */}
              <div className="mt-3">
                <h3 className="font-medium mb-2 text-sm sm:text-base dark:text-gray-300">
                  {t("submittedFiles")}:
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 rounded-md">
                  {existingSubmission.fileUrls.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md transition-all hover:shadow-md"
                    >
                      <p className="truncate text-xs sm:text-sm">
                        {file.fileName}
                      </p>
                      <a
                        href={file.fileUrl}
                        className="text-blue-500 dark:text-blue-400 text-xs sm:text-sm hover:underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("download")}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timer & Resubmit */}
              {isRoundActive() ? (
                <>
                  <p className="mt-4 text-red-600 dark:text-red-400 font-bold text-base sm:text-lg transition-colors">
                    {t("timeLeft")}: {timeLeft}
                  </p>
                  <p className="text-base sm:text-lg font-bold dark:text-gray-300 transition-colors">
                    {t("submitDueDate")}:{" "}
                    {new Date(roundEndTime).toLocaleString()}
                  </p>

                  <button
                    className="mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all text-sm sm:text-base dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                    onClick={handleFileSelect}
                    disabled={isSubmitting}
                    aria-label={t("resubmit")}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        {t("submitting")}
                      </span>
                    ) : (
                      t("resubmit")
                    )}
                  </button>
                </>
              ) : (
                <p className="mt-4 text-gray-600 dark:text-gray-400 font-bold text-sm sm:text-base transition-colors">
                  {timeLeft === t("deadlinePassed")
                    ? t("submissionPeriodEnded")
                    : `${t("submitDueDate")}: ${new Date(roundEndTime).toLocaleString()}`}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4 transition-all">
              <h2 className="text-base sm:text-lg font-semibold dark:text-white">
                {isResubmitting
                  ? t("resubmitWork", { round })
                  : t("submitWork", { round })}
              </h2>

              {/* File Selection UI */}
              <div className="mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  aria-label={t("selectFiles")}
                />

                <button
                  onClick={handleFileSelect}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:outline-none transition-all text-sm sm:text-base"
                  aria-label={t("selectFiles")}
                >
                  {t("selectFiles")}
                </button>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2 text-sm sm:text-base dark:text-gray-300">
                      {t("selectedFiles")}:
                    </h3>
                    <ul className="space-y-2 max-h-56 overflow-y-auto pr-1 rounded-md">
                      {selectedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md hover:shadow-md transition-all"
                        >
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <span className="text-xs sm:text-sm font-medium truncate max-w-[180px] sm:max-w-xs">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs sm:text-sm transition-colors ml-2"
                            aria-label={t("remove")}
                          >
                            {t("remove")}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {isResubmitting && (
                    <button
                      onClick={cancelResubmit}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:outline-none transition-all text-sm sm:text-base"
                      aria-label={t("cancel")}
                    >
                      {t("cancel")}
                    </button>
                  )}

                  {selectedFiles.length > 0 && (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:outline-none transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={isResubmitting ? t("resubmit") : t("submit")}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <LoadingSpinner size="sm" className="mr-2" />
                          {t("submitting")}
                        </span>
                      ) : isResubmitting ? (
                        t("resubmit")
                      ) : (
                        t("submit")
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Timer */}
              {!roundStatus && (
                <>
                  <p className="mt-6 text-red-600 dark:text-red-400 font-bold text-base sm:text-lg transition-colors">
                    {t("timeLeft")}: {timeLeft}
                  </p>
                  <p className="text-base sm:text-lg font-bold dark:text-gray-300 transition-colors">
                    {t("submitDueDate")}:{" "}
                    {new Date(roundEndTime).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
