// src/app/[locale]/hackathon/[id]/_components/HackathonOverview.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth_v0";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { TeamRequest } from "@/types/entities/teamRequest";
import { Team } from "@/types/entities/team";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import EnrollmentModal from "./EnrollmentModal";
import MentorshipModal from "./MentorshipModal";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Import real services
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { teamRequestService } from "@/services/teamRequest.service";
import { teamService } from "@/services/team.service";
import { mentorTeamService } from "@/services/mentorTeam.service";
import { mentorshipRequestService } from "@/services/mentorshipRequest.service";
import { mentorshipSessionRequestService } from "@/services/mentorshipSessionRequest.service";

type HackathonOverviewProps = {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  enrollStartDate: string;
  enrollEndDate: string;
  enrollmentCount: number;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
};

// Helper function to format date strings
const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export default function HackathonOverview({
  id,
  title,
  subtitle,
  startDate,
  endDate,
  enrollStartDate,
  enrollEndDate,
  enrollmentCount,
  minimumTeamMembers,
  maximumTeamMembers,
}: HackathonOverviewProps) {
  const { user } = useAuthStore(); // Get current user
  const { user: authUser } = useAuth(); // Get user with roles from new auth hook
  const router = useRouter();
  const t = useTranslations("hackathon");
  const toast = useToast();

  // Check if the user has TEAM_MEMBER role
  const isTeamMember = authUser?.userRoles?.some(
    (userRole) =>
      userRole.role.name === "TEAM_MEMBER" ||
      userRole.role.name === "TEAM_LEADER"
  );

  const [isHackathonEnded, setIsHackathonEnded] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<
    "notStarted" | "open" | "closed"
  >("open");

  useEffect(() => {
    // Check if current date is after end date
    if (endDate) {
      const currentDate = new Date();
      const hackathonEndDate = new Date(endDate);
      setIsHackathonEnded(currentDate > hackathonEndDate);
    }

    // Check enrollment status based on dates
    const now = new Date();
    const enrollStart = new Date(enrollStartDate);
    const enrollEnd = new Date(enrollEndDate);

    if (now < enrollStart) {
      setEnrollmentStatus("notStarted");
    } else if (now > enrollEnd) {
      setEnrollmentStatus("closed");
    } else {
      setEnrollmentStatus("open");
    }
  }, [endDate, enrollStartDate, enrollEndDate]);

  const handleGoToFeedback = () => {
    router.push(`/hackathon/${id}/feedback`);
  };

  // Use our API modal hook for error and success handling
  const { modalState, hideModal, showError, showSuccess, showInfo } =
    useApiModal();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [individualRegistrations, setIndividualRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [mentorTeams, setMentorTeams] = useState<MentorTeam[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);
  const [mentorshipSessionRequests, setMentorshipSessionRequests] = useState<
    MentorshipSessionRequest[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMentorshipModalOpen, setIsMentorshipModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Define fetchData inside useEffect but don't include external dependencies
    const fetchData = async () => {
      setIsLoading(true);
      // Removed toast notification for initial data loading

      try {
        // Fetch individual registrations
        const indivRegsResponse =
          await individualRegistrationRequestService.getIndividualRegistrationRequestsByUserAndHackathon(
            user.username, // Assuming username is what the API expects
            id
          );

        // Fetch team requests
        const teamReqsResponse =
          await teamRequestService.getTeamRequestsByHackathonAndUser(
            id,
            user.id
          );

        // Fetch teams
        const teamsResponse = await teamService.getTeamsByUserAndHackathon(
          user.id,
          id
        );

        setIndividualRegistrations(indivRegsResponse.data);
        setTeamRequests(teamReqsResponse.data);
        setTeams(teamsResponse.data);

        // Removed success toast for data loading

        if (teamsResponse.data.length === 0) {
          setIsLoading(false);
          return;
        }

        // If user has teams, fetch mentor data
        const mentorTeamsPromises = teamsResponse.data.map((team) =>
          mentorTeamService.getMentorTeamsByHackathonAndTeam(id, team.id)
        );

        const mentorshipRequestsPromises = teamsResponse.data.map((team) =>
          mentorshipRequestService.getMentorshipRequestsByTeamAndHackathon(
            team.id,
            id
          )
        );

        const mentorTeamsResults = await Promise.all(mentorTeamsPromises);
        const mentorshipRequestsResults = await Promise.all(
          mentorshipRequestsPromises
        );

        const allMentorTeams = mentorTeamsResults.flatMap(
          (result) => result.data
        );
        const allMentorshipRequests = mentorshipRequestsResults.flatMap(
          (result) => result.data
        );

        setMentorTeams(allMentorTeams);
        setMentorshipRequests(allMentorshipRequests);

        // Now fetch session requests separately for each mentor team
        if (allMentorTeams.length > 0) {
          const sessionRequestsPromises = allMentorTeams.map((mentorTeam) =>
            mentorshipSessionRequestService.getMentorshipSessionRequestsByMentorTeamId(
              mentorTeam.id
            )
          );

          const sessionRequestsResults = await Promise.all(
            sessionRequestsPromises
          );
          const allSessionRequests = sessionRequestsResults.flatMap(
            (result) => result.data
          );

          setMentorshipSessionRequests(allSessionRequests);
        }
      } catch (error: any) {
        console.error("Failed to fetch hackathon data:", error);
        // Only log the error, don't show toast for background errors
        // Keep the error in the console for debugging purposes
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, id]);

  // Determine button title based on enrollment status
  const getButtonTitle = () => {
    if (teams.length > 0) {
      return t("viewTeamEnrollment");
    } else if (teamRequests.length > 0) {
      return t("viewTeamRequest");
    } else if (individualRegistrations.length > 0) {
      return t("viewIndividualEnrollment");
    }
    return t("enroll");
  };

  // Determine mentorship button title
  const getMentorshipButtonTitle = () => {
    if (mentorTeams.length > 0) {
      return t("viewMentorship");
    } else if (mentorshipRequests.length > 0) {
      return t("viewMentorshipRequest");
    }
    return t("requestMentorship");
  };

  const handleGoToBoard = () => {
    if (teams.length > 0) {
      router.push(`/hackathon/${id}/team/${teams[0].id}/board`);
    }
  };

  const handleDataUpdate = async () => {
    if (!user || teams.length === 0) return;

    try {
      setIsUpdating(true);
      // This is a user-initiated action, so we keep the toast
      //toast.info(t("updatingData"));

      // Fetch updated mentor data
      const mentorTeamsPromises = teams.map((team) =>
        mentorTeamService.getMentorTeamsByHackathonAndTeam(id, team.id)
      );

      const mentorshipRequestsPromises = teams.map((team) =>
        mentorshipRequestService.getMentorshipRequestsByTeamAndHackathon(
          team.id,
          id
        )
      );

      const mentorTeamsResults = await Promise.all(mentorTeamsPromises);
      const mentorshipRequestsResults = await Promise.all(
        mentorshipRequestsPromises
      );

      const allMentorTeams = mentorTeamsResults.flatMap(
        (result) => result.data
      );
      const allMentorshipRequests = mentorshipRequestsResults.flatMap(
        (result) => result.data
      );

      setMentorTeams(allMentorTeams);
      setMentorshipRequests(allMentorshipRequests);

      // Now fetch session requests separately for each mentor team
      if (allMentorTeams.length > 0) {
        const sessionRequestsPromises = allMentorTeams.map((mentorTeam) =>
          mentorshipSessionRequestService.getMentorshipSessionRequestsByMentorTeamId(
            mentorTeam.id
          )
        );

        const sessionRequestsResults = await Promise.all(
          sessionRequestsPromises
        );
        const allSessionRequests = sessionRequestsResults.flatMap(
          (result) => result.data
        );

        setMentorshipSessionRequests(allSessionRequests);
      }

      // Keep success toast for user-initiated action
      const successMessage =
        mentorTeamsResults[0]?.message || t("dataUpdateSuccess");
      //toast.success(successMessage);
      //showSuccess(t("dataUpdatedTitle"), successMessage);
    } catch (error: any) {
      console.error("Failed to update mentorship data:", error);
      const errorMessage = error?.message || t("dataUpdateError");
      // Keep error toast for user-initiated action
      toast.error(errorMessage);
      showError(t("updateErrorTitle"), errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // Generate enrollment status message - only show if user doesn't have a team
  const getEnrollmentStatusMessage = () => {
    // If user already has a team, don't show enrollment status message
    if (teams.length > 0) {
      return null;
    }

    switch (enrollmentStatus) {
      case "notStarted":
        return t("enrollmentNotStarted");
      case "closed":
        return t("enrollmentClosed");
      default:
        return null;
    }
  };

  // Check if enrollment button should be disabled - not disabled if user already has a team
  const isEnrollButtonDisabled = () => {
    // If user already has a team, allow them to view their enrollment regardless of enrollment status
    if (
      teams.length > 0 ||
      teamRequests.length > 0 ||
      individualRegistrations.length > 0
    ) {
      return false;
    }

    // For users without any enrollment, disable based on enrollment status
    return enrollmentStatus !== "open";
  };

  // Get enrollment button style - blue for active, gray for disabled
  const getEnrollButtonStyle = () => {
    // If user already has a team or enrollment, always show active button
    if (
      teams.length > 0 ||
      teamRequests.length > 0 ||
      individualRegistrations.length > 0
    ) {
      return "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 hover:scale-105 active:scale-95";
    }

    // For users without any enrollment, style based on enrollment status
    return enrollmentStatus === "open"
      ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 hover:scale-105 active:scale-95"
      : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed";
  };

  return (
    <>
      <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow transition-colors duration-300">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          {subtitle}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
          {isLoading ? (
            <button
              className="bg-gray-400 dark:bg-gray-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full cursor-not-allowed flex items-center justify-center min-w-[140px] transition-colors duration-300"
              disabled
            >
              <LoadingSpinner size="sm" className="mr-2" />
              {t("loading")}
            </button>
          ) : isTeamMember ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className={`${getEnrollButtonStyle()} text-white font-bold py-2 px-4 sm:px-6 rounded-full transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500`}
                onClick={() => setIsModalOpen(true)}
                disabled={isEnrollButtonDisabled()}
                aria-label={getButtonTitle()}
              >
                {getButtonTitle()}
              </button>
              {getEnrollmentStatusMessage() && (
                <p className="text-sm text-amber-500 dark:text-amber-400 font-medium self-center">
                  {getEnrollmentStatusMessage()}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className="bg-gray-400 dark:bg-gray-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full cursor-not-allowed transition-colors duration-300"
                disabled
                aria-disabled="true"
              >
                {getButtonTitle()}
              </button>
              <p className="text-sm text-red-500 dark:text-red-400 self-center">
                {t("teamMemberOnly")}
              </p>
            </div>
          )}

          {!isLoading && teams.length > 0 && (
            <>
              <button
                className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500"
                onClick={() => setIsMentorshipModalOpen(true)}
                disabled={isUpdating}
                aria-label={getMentorshipButtonTitle()}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    {t("updating")}
                  </span>
                ) : (
                  getMentorshipButtonTitle()
                )}
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-500"
                onClick={handleGoToBoard}
                aria-label={t("goToBoard")}
              >
                {t("goToBoard")}
              </button>
              {isHackathonEnded && (
                <button
                  className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-500"
                  onClick={handleGoToFeedback}
                  aria-label={t("feedback")}
                >
                  {t("feedback")}
                </button>
              )}
            </>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 dark:text-gray-400 text-sm">
          <p>
            📅 {t("hackathonStartDate")}: {formatDate(startDate)}
          </p>
          <p>
            📅 {t("hackathonEndDate")}: {formatDate(endDate)}
          </p>
          <p>
            🔓 {t("enrollmentStartDate")}: {formatDate(enrollStartDate)}
          </p>
          <p>
            🔒 {t("enrollmentEndDate")}: {formatDate(enrollEndDate)}
          </p>
        </div>

        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
          {enrollmentCount === 1
            ? t("onePersonRegistered")
            : t("multiplePersonsRegistered", { count: enrollmentCount })}
        </p>
      </div>

      {isTeamMember && (
        <EnrollmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          individualRegistrations={individualRegistrations}
          teamRequests={teamRequests}
          teams={teams}
          hackathonId={id}
          minimumTeamMembers={minimumTeamMembers}
          maximumTeamMembers={maximumTeamMembers}
          onDataUpdate={() => {
            // This is a user-initiated action (closing modal), so toast is appropriate
            if (user) {
              setIsUpdating(true);
              toast.info(t("refreshingEnrollmentData"));

              Promise.all([
                individualRegistrationRequestService.getIndividualRegistrationRequestsByUserAndHackathon(
                  user.username,
                  id
                ),
                teamRequestService.getTeamRequestsByHackathonAndUser(
                  id,
                  user.id
                ),
                teamService.getTeamsByUserAndHackathon(user.id, id),
              ])
                .then(([indivRegs, teamReqs, teams]) => {
                  setIndividualRegistrations(indivRegs.data);
                  setTeamRequests(teamReqs.data);
                  setTeams(teams.data);
                  toast.success(t("enrollmentDataRefreshed"));
                })
                .catch((error: any) => {
                  console.error("Failed to update enrollment data:", error);
                  const errorMessage =
                    error?.message || t("enrollmentDataRefreshError");
                  toast.error(errorMessage);
                  showError(t("updateErrorTitle"), errorMessage);
                })
                .finally(() => {
                  setIsUpdating(false);
                });
            }
          }}
        />
      )}

      <MentorshipModal
        isOpen={isMentorshipModalOpen}
        onClose={() => setIsMentorshipModalOpen(false)}
        mentorTeams={mentorTeams}
        mentorshipRequests={mentorshipRequests}
        mentorshipSessionRequests={mentorshipSessionRequests}
        hackathonId={id}
        teamId={teams.length > 0 ? teams[0].id : ""}
        onDataUpdate={handleDataUpdate}
      />

      {/* API Response Modal for showing success/error messages */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </>
  );
}
