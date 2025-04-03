// src/app/hackathon/[id]/_components/HackathonOverview.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
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
  date: string;
  enrollmentCount: number;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
};

export default function HackathonOverview({
  id,
  title,
  subtitle,
  date,
  enrollmentCount,
  minimumTeamMembers,
  maximumTeamMembers,
}: HackathonOverviewProps) {
  const { user } = useAuthStore(); // Get current user
  const router = useRouter();

  // Use our API modal hook for error and success handling
  const { modalState, hideModal, showError, showSuccess, showInfo } =
    useApiModal();

  const [isLoading, setIsLoading] = useState(true);
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

    // Fetch all data
    const fetchData = async () => {
      setIsLoading(true);
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

        if (allMentorTeams.length === 0) {
          setIsLoading(false);
          return;
        }

        // If mentor teams exist, fetch session requests
        const mentorshipSessionPromises = allMentorTeams.map((mentorTeam) =>
          mentorshipSessionRequestService.getMentorshipSessionRequestsByMentorTeamId(
            mentorTeam.id
          )
        );

        const mentorshipSessionResults = await Promise.all(
          mentorshipSessionPromises
        );
        const allMentorshipSessions = mentorshipSessionResults.flatMap(
          (result) => result.data
        );

        setMentorshipSessionRequests(allMentorshipSessions);
      } catch (error) {
        console.error("Failed to fetch hackathon data:", error);
        showError(
          "Data Loading Error",
          "Failed to load hackathon participation data. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, id, showError]);

  // Determine button title
  let buttonTitle = "Enroll";
  if (teams.length > 0) {
    buttonTitle = "View Team Enrollment";
  } else if (teamRequests.length > 0) {
    buttonTitle = "View Team Request";
  } else if (individualRegistrations.length > 0) {
    buttonTitle = "View Individual Enrollment";
  }

  // Determine mentorship button title
  let mentorshipButtonTitle = "Request Mentorship";
  if (mentorTeams.length > 0) {
    mentorshipButtonTitle = "View Mentorship";
  } else if (mentorshipRequests.length > 0) {
    mentorshipButtonTitle = "View Mentorship Request";
  }

  const handleGoToBoard = () => {
    if (teams.length > 0) {
      // Assuming the board URL pattern (adjust if needed)
      router.push(`/hackathon/${id}/team/${teams[0].id}/board`);
    }
  };

  const handleDataUpdate = async () => {
    if (!user || teams.length === 0) return;

    try {
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

      if (allMentorTeams.length === 0) return;

      // If mentor teams exist, fetch session requests
      const mentorshipSessionPromises = allMentorTeams.map((mentorTeam) =>
        mentorshipSessionRequestService.getMentorshipSessionRequestsByMentorTeamId(
          mentorTeam.id
        )
      );

      const mentorshipSessionResults = await Promise.all(
        mentorshipSessionPromises
      );
      const allMentorshipSessions = mentorshipSessionResults.flatMap(
        (result) => result.data
      );

      setMentorshipSessionRequests(allMentorshipSessions);

      showSuccess(
        "Data Updated",
        "Mentorship data has been successfully updated."
      );
    } catch (error) {
      console.error("Failed to update mentorship data:", error);
      showError(
        "Update Error",
        "Failed to update mentorship data. Please try again later."
      );
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">📅 {date}</p>
        <p className="mt-4 text-gray-700 text-sm sm:text-base">{subtitle}</p>
        <div className="mt-6 flex gap-4">
          {isLoading ? (
            <button
              className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full cursor-not-allowed"
              disabled
            >
              Loading...
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition"
              onClick={() => setIsModalOpen(true)}
            >
              {buttonTitle}
            </button>
          )}

          {!isLoading && teams.length > 0 && (
            <>
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full transition"
                onClick={() => setIsMentorshipModalOpen(true)}
              >
                {mentorshipButtonTitle}
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition"
                onClick={handleGoToBoard}
              >
                Go to board
              </button>
            </>
          )}
        </div>
        <p className="mt-2 text-gray-500 text-sm">
          {enrollmentCount === 1
            ? "1 person has registered to participate"
            : `${enrollmentCount} people have registered to participate`}
        </p>
      </div>

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
          // Refetch data when enrollment changes
          if (user) {
            Promise.all([
              individualRegistrationRequestService.getIndividualRegistrationRequestsByUserAndHackathon(
                user.username,
                id
              ),
              teamRequestService.getTeamRequestsByHackathonAndUser(id, user.id),
              teamService.getTeamsByUserAndHackathon(user.id, id),
            ])
              .then(([indivRegs, teamReqs, teams]) => {
                setIndividualRegistrations(indivRegs.data);
                setTeamRequests(teamReqs.data);
                setTeams(teams.data);
              })
              .catch((error) => {
                console.error("Failed to update enrollment data:", error);
                showError("Update Error", "Failed to refresh enrollment data.");
              });
          }
        }}
      />

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
