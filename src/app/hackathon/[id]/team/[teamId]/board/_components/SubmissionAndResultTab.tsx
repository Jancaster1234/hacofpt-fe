// src/app/hackathon/[id]/team/[teamId]/board/_components/SubmissionAndResultTab.tsx
"use client";

import { useState, useEffect } from "react";
import SubmissionTab from "./SubmissionTab";
import ResultTab from "./ResultTab";
import RewardListTab from "./RewardListTab";
import { Round } from "@/types/entities/round";
import { Submission } from "@/types/entities/submission";
import { fetchMockSubmissions } from "../_mock/fetchMockSubmissions";
import { submissionService } from "@/services/submission.service";
import { useAuth } from "@/hooks/useAuth_v0";
interface Props {
  rounds: Round[];
  loading: boolean;
  hackathonId: string;
  teamId: string; // Added teamId parameter
}

export default function SubmissionAndResultTab({
  rounds,
  loading,
  hackathonId,
  teamId, // Make sure this prop is passed from the parent component
}: Props) {
  const { user } = useAuth();
  const roundTabs = rounds.map((round) => round.roundTitle);
  const [activeRoundTab, setActiveRoundTab] = useState(roundTabs[0] || "");
  const [activeSubTab, setActiveSubTab] = useState("Submission");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const activeRound = rounds.find(
    (round) => round.roundTitle === activeRoundTab
  );
  const roundId = activeRound?.id || "";
  const roundStartTime = activeRound?.startTime || "";
  const roundEndTime = activeRound?.endTime || "";

  useEffect(() => {
    const loadSubmissions = async () => {
      if (!activeRoundTab) return;
      setSubmissionsLoading(true);
      try {
        const fetchedSubmissions =
          await submissionService.getSubmissionsByRoundAndCreator(
            roundId,
            user.id
          );
        setSubmissions(fetchedSubmissions as Submission[]);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      }
      setSubmissionsLoading(false);
    };
    loadSubmissions();
  }, [activeRoundTab, roundId]);

  // Handle new submission or resubmission completion
  const handleSubmissionComplete = (newSubmission: Submission) => {
    // Update the submissions list by replacing or adding the new submission
    setSubmissions((prevSubmissions) => {
      const submissionIndex = prevSubmissions.findIndex(
        (sub) => sub.status === "SUBMITTED"
      );

      if (submissionIndex >= 0) {
        // Replace existing submitted submission
        const updatedSubmissions = [...prevSubmissions];
        updatedSubmissions[submissionIndex] = newSubmission;
        return updatedSubmissions;
      } else {
        // Add new submission
        return [...prevSubmissions, newSubmission];
      }
    });
  };

  if (loading) return <p>Loading rounds...</p>;
  if (rounds.length === 0)
    return <p className="text-gray-500">No rounds available.</p>;

  return (
    <div>
      {/* Round Navigation */}
      <div className="flex border-b border-gray-200 space-x-4">
        {roundTabs.map((round) => (
          <button
            key={round}
            className={`px-4 py-2 text-sm font-medium ${
              activeRoundTab === round
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveRoundTab(round)}
          >
            {round}
          </button>
        ))}
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeRoundTab === "Reward Recipient List"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveRoundTab("Reward Recipient List")}
        >
          Reward Recipient List
        </button>
      </div>

      {/* Conditionally Show Submission & Result Tabs */}
      {roundTabs.includes(activeRoundTab) ? (
        <div className="flex space-x-4 mt-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSubTab === "Submission"
                ? "bg-gray-300 text-black font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveSubTab("Submission")}
          >
            Submission
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSubTab === "Result"
                ? "bg-gray-300 text-black font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveSubTab("Result")}
          >
            Result
          </button>
        </div>
      ) : null}

      {/* Display Content Based on Active Tab */}
      <div className="mt-4 p-4 border rounded-lg bg-white shadow">
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
  );
}
