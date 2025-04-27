// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/SubmissionAndResultTab.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import SubmissionTab from "./SubmissionTab";
import ResultTab from "./ResultTab";
import RewardListTab from "./RewardListTab";
import { Round } from "@/types/entities/round";
import { Submission } from "@/types/entities/submission";
import { submissionService } from "@/services/submission.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  rounds: Round[];
  loading: boolean;
  hackathonId: string;
  teamId: string;
}

export default function SubmissionAndResultTab({
  rounds,
  loading,
  hackathonId,
  teamId,
}: Props) {
  const t = useTranslations("submissionAndResult");
  const toast = useToast();
  const roundTabs = rounds.map((round) => round.roundTitle);
  const [activeRoundTab, setActiveRoundTab] = useState(roundTabs[0] || "");
  const [activeSubTab, setActiveSubTab] = useState("Submission");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Use the API modal hook
  const { modalState, hideModal, showError } = useApiModal();

  const activeRound = rounds.find(
    (round) => round.roundTitle === activeRoundTab
  );
  const roundId = activeRound?.id || "";
  const roundStartTime = activeRound?.startTime || "";
  const roundEndTime = activeRound?.endTime || "";

  // Memoize the loadSubmissions function to prevent recreating it on each render
  const loadSubmissions = useCallback(async () => {
    if (!activeRoundTab || !roundId || !teamId) return;

    setSubmissionsLoading(true);

    try {
      const response = await submissionService.getSubmissionsByTeamAndRound(
        teamId,
        roundId
      );

      if (response.data && Array.isArray(response.data)) {
        setSubmissions(response.data);
      } else {
        const errorMessage =
          response.message || t("errors.invalidResponseFormat");
        // Only show error toast if the error is meaningful
        if (response.message) {
          toast.error(errorMessage);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error loading submissions:", error);
      // Don't put toast inside the dependency array
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      }
      // Initialize with empty array instead of mock data
      setSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  }, [activeRoundTab, roundId, teamId, t]); // Removed toast from dependencies

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // Handle new submission or resubmission completion
  const handleSubmissionComplete = useCallback(
    (newSubmission: Submission) => {
      // Update the submissions list by replacing or adding the new submission
      setSubmissions((prevSubmissions) => {
        const submissionIndex = prevSubmissions.findIndex(
          (sub) => sub.status === "SUBMITTED"
        );

        if (submissionIndex >= 0) {
          // Replace existing submitted submission
          const updatedSubmissions = [...prevSubmissions];
          updatedSubmissions[submissionIndex] = newSubmission;
          // Show success toast outside of the state update to avoid re-renders
          setTimeout(
            () => toast.success(t("notifications.submissionUpdated")),
            0
          );
          return updatedSubmissions;
        } else {
          // Add new submission
          // Show success toast outside of the state update to avoid re-renders
          setTimeout(
            () => toast.success(t("notifications.submissionCreated")),
            0
          );
          return [...prevSubmissions, newSubmission];
        }
      });
    },
    [t, toast]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 transition-all">
        <LoadingSpinner size="lg" showText />
      </div>
    );
  }

  if (rounds.length === 0)
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-12 transition-colors">
        {t("noRoundsAvailable")}
      </div>
    );

  return (
    <div className="transition-colors duration-300">
      {/* Round Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 space-x-2 md:space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pb-1">
        {roundTabs.map((round) => (
          <button
            key={round}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap ${
              activeRoundTab === round
                ? "border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold bg-gray-50 dark:bg-gray-800"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveRoundTab(round)}
            aria-current={activeRoundTab === round ? "page" : undefined}
          >
            {round}
          </button>
        ))}
        <button
          className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap ${
            activeRoundTab === "Reward Recipient List"
              ? "border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold bg-gray-50 dark:bg-gray-800"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveRoundTab("Reward Recipient List")}
          aria-current={
            activeRoundTab === "Reward Recipient List" ? "page" : undefined
          }
        >
          {t("rewardRecipientList")}
        </button>
      </div>

      {/* Conditionally Show Submission & Result Tabs */}
      {roundTabs.includes(activeRoundTab) && (
        <div className="flex space-x-2 sm:space-x-4 mt-4">
          <button
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
              activeSubTab === "Submission"
                ? "bg-gray-300 dark:bg-gray-700 text-black dark:text-white font-semibold shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveSubTab("Submission")}
            aria-current={activeSubTab === "Submission" ? "page" : undefined}
          >
            {t("submission")}
          </button>
          <button
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
              activeSubTab === "Result"
                ? "bg-gray-300 dark:bg-gray-700 text-black dark:text-white font-semibold shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveSubTab("Result")}
            aria-current={activeSubTab === "Result" ? "page" : undefined}
          >
            {t("result")}
          </button>
        </div>
      )}

      {/* Display Content Based on Active Tab */}
      <div className="mt-4 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow transition-all duration-300">
        {submissionsLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
            <LoadingSpinner size="md" />
          </div>
        )}

        <div className="relative">
          {activeRoundTab === "Reward Recipient List" ? (
            <RewardListTab hackathonId={hackathonId} />
          ) : activeSubTab === "Submission" ? (
            <SubmissionTab
              round={activeRoundTab}
              roundId={roundId}
              teamId={teamId}
              submissions={submissions}
              loading={submissionsLoading}
              roundStartTime={roundStartTime}
              roundEndTime={roundEndTime}
              onSubmissionComplete={handleSubmissionComplete}
            />
          ) : (
            <ResultTab
              roundId={roundId}
              roundTitle={activeRoundTab}
              submissions={submissions}
            />
          )}
        </div>
      </div>

      {/* API Response Modal */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
