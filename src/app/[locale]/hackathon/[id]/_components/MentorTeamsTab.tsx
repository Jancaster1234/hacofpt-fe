// src/app/[locale]/hackathon/[id]/_components/MentorTeamsTab.tsx
import { useState } from "react";
import Image from "next/image";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import SessionRequestForm from "./SessionRequestForm";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

type MentorTeamsTabProps = {
  mentorTeams: MentorTeam[];
  mentorshipSessionRequests: MentorshipSessionRequest[];
  onCreateSessionRequest: (data: {
    mentorTeamId: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  }) => Promise<void>;
};

export default function MentorTeamsTab({
  mentorTeams,
  mentorshipSessionRequests,
  onCreateSessionRequest,
}: MentorTeamsTabProps) {
  const t = useTranslations("mentorTeams");
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maximum number of pending requests allowed per mentor team
  const MAX_PENDING_REQUESTS = 3;

  const handleRequestSession = (teamId: string) => {
    // Check if the team already has the maximum number of pending requests
    const pendingRequests = mentorshipSessionRequests.filter(
      (session) =>
        session.mentorTeam?.id === teamId && session.status === "PENDING"
    );

    if (pendingRequests.length >= MAX_PENDING_REQUESTS) {
      toast.error(
        t("maxPendingRequestsReached", { count: MAX_PENDING_REQUESTS })
      );
      return;
    }

    setSelectedTeamId(teamId);
    setShowForm(true);
  };

  const handleSubmit = async (data: {
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  }) => {
    setIsSubmitting(true);
    try {
      await onCreateSessionRequest({
        ...data,
        mentorTeamId: selectedTeamId,
      });
      // If execution reaches here, it means the parent component didn't throw an error
      setShowForm(false);
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Error submitting session request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get session requests for a specific mentor team
  const getSessionRequestsForMentorTeam = (mentorTeamId: string) => {
    return mentorshipSessionRequests.filter(
      (session) => session.mentorTeam?.id === mentorTeamId
    );
  };

  // Check if a team has reached the maximum number of pending requests
  const hasReachedMaxPendingRequests = (mentorTeamId: string) => {
    const pendingRequests = mentorshipSessionRequests.filter(
      (session) =>
        session.mentorTeam?.id === mentorTeamId && session.status === "PENDING"
    );
    return pendingRequests.length >= MAX_PENDING_REQUESTS;
  };

  // Get pending request count for a mentor team
  const getPendingRequestCount = (mentorTeamId: string) => {
    return mentorshipSessionRequests.filter(
      (session) =>
        session.mentorTeam?.id === mentorTeamId && session.status === "PENDING"
    ).length;
  };

  // Map status to translation key and style
  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { class: string; key: string }> = {
      APPROVED: {
        class:
          "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200",
        key: "statusApproved",
      },
      REJECTED: {
        class: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200",
        key: "statusRejected",
      },
      PENDING: {
        class:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200",
        key: "statusPending",
      },
      DELETED: {
        class: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
        key: "statusDeleted",
      },
      COMPLETED: {
        class: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200",
        key: "statusCompleted",
      },
    };

    return (
      statusMap[status] || {
        class: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
        key: "statusUnknown",
      }
    );
  };

  return (
    <div className="transition-colors duration-300">
      {showForm && (
        <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300">
          <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-100">
            {t("requestNewSession")}
          </h3>
          <SessionRequestForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {mentorTeams.length > 0 ? (
        <ul className="space-y-4 md:space-y-6">
          {mentorTeams.map((mentorTeam) => {
            const teamSessionRequests = getSessionRequestsForMentorTeam(
              mentorTeam.id
            );
            const pendingCount = getPendingRequestCount(mentorTeam.id);
            const maxReached = hasReachedMaxPendingRequests(mentorTeam.id);

            return (
              <li
                key={mentorTeam.id}
                className="p-4 sm:p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md dark:border-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={
                        mentorTeam.mentor.avatarUrl || "/placeholder-avatar.png"
                      }
                      alt={`${mentorTeam.mentor.firstName} ${mentorTeam.mentor.lastName}`}
                      className="rounded-full object-cover bg-gray-200 dark:bg-gray-600"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">
                      {mentorTeam.mentor.firstName} {mentorTeam.mentor.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mentorTeam.mentor.email}
                    </p>
                  </div>
                </div>

                {pendingCount > 0 && (
                  <div className="mt-2 mb-3">
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">
                      {t("pendingRequestsCount", {
                        count: pendingCount,
                        max: MAX_PENDING_REQUESTS,
                      })}
                    </span>
                  </div>
                )}

                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                    {t("sessionRequests")}:
                  </h4>
                  {teamSessionRequests && teamSessionRequests.length > 0 ? (
                    <ul className="mt-2 space-y-2 md:space-y-3">
                      {teamSessionRequests.map((session) => {
                        const statusConfig = getStatusConfig(session.status);

                        return (
                          <li
                            key={session.id}
                            className="text-sm p-3 bg-white dark:bg-gray-700 rounded border dark:border-gray-600 shadow-sm transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <div className="font-medium text-gray-800 dark:text-gray-100">
                                {session.description}
                              </div>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full inline-block ${statusConfig.class}`}
                              >
                                {t(statusConfig.key)}
                              </span>
                            </div>
                            <div className="mt-2 text-gray-600 dark:text-gray-300">
                              📅 {new Date(session.startTime).toLocaleString()}{" "}
                              - {new Date(session.endTime).toLocaleString()}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                              📍 {session.location}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {t("noSessionRequests")}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-sm px-3 py-1.5 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                      maxReached
                        ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500"
                    }`}
                    onClick={() => handleRequestSession(mentorTeam.id)}
                    disabled={maxReached}
                    title={
                      maxReached
                        ? t("maxPendingRequestsTooltip", {
                            max: MAX_PENDING_REQUESTS,
                          })
                        : ""
                    }
                  >
                    {maxReached ? t("maxRequestsReached") : t("requestSession")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-8 px-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300">
          <p className="text-gray-500 dark:text-gray-400">{t("noMentors")}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {t("requestMentorTip")}
          </p>
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <LoadingSpinner size="md" showText={true} />
          </div>
        </div>
      )}
    </div>
  );
}
