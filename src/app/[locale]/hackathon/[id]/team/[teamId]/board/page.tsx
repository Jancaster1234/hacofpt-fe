"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import KanbanBoardWithAuth from "./_components/KanbanBoardWithAuth";
import Calendar from "@/components/calendar/Calendar";
import SubmissionAndResultTab from "./_components/SubmissionAndResultTab";
import { Round } from "@/types/entities/round";
import { Team } from "@/types/entities/team";
import { Board } from "@/types/entities/board";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { roundService } from "@/services/round.service";
import { teamService } from "@/services/team.service";
import { boardService } from "@/services/board.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function HackathonBoardPage() {
  const t = useTranslations("hackathonBoard");
  const toast = useToast();
  const { id, teamId } = useParams();
  const hackathonId = Array.isArray(id) ? id[0] : id;
  const teamIdValue = Array.isArray(teamId) ? teamId[0] : teamId;

  const TABS = [
    t("tabs.taskBoard"),
    t("tabs.submissionAndResult"),
    t("tabs.schedule"),
  ];

  const [rounds, setRounds] = useState<Round[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(true);
  const [boardLoading, setBoardLoading] = useState(true);

  // Track if calendar data has been loaded
  const [calendarInitialized, setCalendarInitialized] = useState(false);

  // Use the API modal hook
  const { modalState, hideModal, showError } = useApiModal();

  // Memoize the fetchInitialData function
  const fetchInitialData = useCallback(async () => {
    if (!hackathonId || !teamIdValue) return;

    setLoading(true);

    try {
      // Fetch team data
      const teamResponse = await teamService.getTeamById(teamIdValue);
      if (teamResponse.data) {
        setTeam(teamResponse.data);
      } else if (teamResponse.message) {
        // Only show error toast if there's a message
        toast.error(teamResponse.message);
      }

      // Fetch boards using the new method
      const boardsResponse = await boardService.getBoardsByTeamIdAndHackathonId(
        teamIdValue,
        hackathonId
      );
      if (boardsResponse.data) {
        setBoards(boardsResponse.data);
      } else if (boardsResponse.message) {
        // Only show error toast if there's a message
        toast.error(boardsResponse.message);
      }

      setBoardLoading(false);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      // Handle error outside of dependency array
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [hackathonId, teamIdValue]); // Remove toast from dependencies

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Memoize the fetchRounds function
  const fetchRounds = useCallback(async () => {
    if (!hackathonId) return;

    try {
      const response = await roundService.getRoundsByHackathonId(hackathonId);
      if (response.data) {
        setRounds(response.data);
      } else if (response.message) {
        // Only show error toast if there's a message
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
      // Handle error outside of dependency array
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      }
    }
  }, [hackathonId]); // Remove toast from dependencies

  // Fetch rounds data only when the "Submission and Result" tab is active
  useEffect(() => {
    if (activeTab === t("tabs.submissionAndResult") && rounds.length === 0) {
      fetchRounds();
    }
  }, [activeTab, rounds.length, fetchRounds, t]);

  // Mark calendar as initialized when the Schedule tab is selected for the first time
  useEffect(() => {
    if (activeTab === t("tabs.schedule") && !calendarInitialized) {
      setCalendarInitialized(true);
    }
  }, [activeTab, calendarInitialized, t]);

  return (
    <div className="p-3 sm:p-6 transition-colors duration-300">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab
                ? "border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? "page" : undefined}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm transition-all duration-300">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" showText />
          </div>
        )}

        {!loading && activeTab === t("tabs.taskBoard") && (
          <KanbanBoardWithAuth
            board={boards.length > 0 ? boards[0] : null}
            team={team}
            isLoading={boardLoading}
          />
        )}

        {!loading && activeTab === t("tabs.submissionAndResult") && (
          <SubmissionAndResultTab
            rounds={rounds}
            loading={loading || rounds.length === 0}
            hackathonId={hackathonId}
            teamId={teamIdValue}
          />
        )}

        {!loading && activeTab === t("tabs.schedule") && (
          <div className="transition-opacity duration-300">
            <Calendar teamId={teamIdValue} hackathonId={hackathonId} />
          </div>
        )}
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
