// src/app/[locale]/hackathon/[id]/team/[teamId]/board/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import KanbanBoard from "./_components/KanbanBoard";
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

  useEffect(() => {
    if (!hackathonId || !teamIdValue) return;

    // Start with essential data only
    const fetchInitialData = async () => {
      setLoading(true);

      try {
        // Fetch team data
        const teamResponse = await teamService.getTeamById(teamIdValue);
        if (teamResponse.data) {
          setTeam(teamResponse.data);
        } else {
          toast.error(teamResponse.message || t("errors.failedToLoadTeam"));
        }

        // Fetch boards using the new method
        const boardsResponse =
          await boardService.getBoardsByTeamIdAndHackathonId(
            teamIdValue,
            hackathonId
          );
        if (boardsResponse.data) {
          setBoards(boardsResponse.data);
        } else {
          toast.error(boardsResponse.message || t("errors.failedToLoadBoards"));
        }

        setBoardLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : t("errors.failedToLoadInitialData")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [hackathonId, teamIdValue, showError, toast, t]);

  // Fetch rounds data only when the "Submission and Result" tab is active
  useEffect(() => {
    if (
      activeTab === t("tabs.submissionAndResult") &&
      rounds.length === 0 &&
      hackathonId
    ) {
      const fetchRounds = async () => {
        try {
          const response =
            await roundService.getRoundsByHackathonId(hackathonId);
          if (response.data) {
            setRounds(response.data);
          } else {
            toast.error(response.message || t("errors.failedToFetchRounds"));
          }
        } catch (error) {
          console.error("Error fetching rounds:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : t("errors.failedToLoadRounds")
          );
        }
      };

      fetchRounds();
    }
  }, [activeTab, rounds.length, hackathonId, showError, toast, t]);

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
          <KanbanBoard
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
