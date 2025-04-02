// src/app/hackathon/[id]/_components/HackathonOverview.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { fetchMockIndividualRegistrations } from "../_mock/fetchMockIndividualRegistrations";
import { fetchMockTeamRequests } from "../_mock/fetchMockTeamRequests";
import { fetchMockTeams } from "../_mock/fetchMockTeams";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { fetchMockMentorTeams } from "../_mock/fetchMockMentorTeams";
import { fetchMockMentorshipRequests } from "../_mock/fetchMockMentorshipRequests";
import { fetchMockMentorshipSessionRequests } from "../_mock/fetchMockMentorshipSessionRequests";
import { TeamRequest } from "@/types/entities/teamRequest";
import { Team } from "@/types/entities/team";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import EnrollmentModal from "./EnrollmentModal";
import MentorshipModal from "./MentorshipModal";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { teamRequestService } from "@/services/teamRequest.service";
import { teamService } from "@/services/team.service";
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
      const [indivRegs, teamReqs, userTeams] = await Promise.all([
        fetchMockIndividualRegistrations(user.id, id),
        teamRequestService.getTeamRequestsByHackathonAndUser(id, user.id),
        fetchMockTeams(user.id, id),
      ]);

      setIndividualRegistrations(indivRegs);
      setTeamRequests(teamReqs);
      setTeams(userTeams);

      if (userTeams.length === 0) return;

      const mentorTeamPromises = userTeams.map((team) =>
        fetchMockMentorTeams(id, team.id)
      );
      const mentorshipRequestPromises = userTeams.map((team) =>
        fetchMockMentorshipRequests(id, team.id)
      );

      const mentorTeamsResults = await Promise.all(mentorTeamPromises);
      const mentorshipRequestsResults = await Promise.all(
        mentorshipRequestPromises
      );

      const allMentorTeams = mentorTeamsResults.flat();
      const allMentorshipRequests = mentorshipRequestsResults.flat();

      setMentorTeams(allMentorTeams);
      setMentorshipRequests(allMentorshipRequests);

      if (allMentorTeams.length === 0) return;

      const mentorshipSessionPromises = allMentorTeams.map((mentorTeam) =>
        fetchMockMentorshipSessionRequests(mentorTeam.id)
      );
      const mentorshipSessionResults = await Promise.all(
        mentorshipSessionPromises
      );

      setMentorshipSessionRequests(mentorshipSessionResults.flat());
    };

    fetchData();
  }, [user, id]);

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

  return (
    <>
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">📅 {date}</p>
        <p className="mt-4 text-gray-700 text-sm sm:text-base">{subtitle}</p>
        <div className="mt-6 flex gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition"
            onClick={() => setIsModalOpen(true)}
          >
            {buttonTitle}
          </button>
          {teams.length > 0 && (
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
      />
      <MentorshipModal
        isOpen={isMentorshipModalOpen}
        onClose={() => setIsMentorshipModalOpen(false)}
        mentorTeams={mentorTeams}
        mentorshipRequests={mentorshipRequests}
        mentorshipSessionRequests={mentorshipSessionRequests}
        hackathonId={id}
        teamId={teams.length > 0 ? teams[0].id : ""}
        onDataUpdate={() => {
          // Fetch updated data when changes are made
          const fetchUpdatedData = async () => {
            if (!user || teams.length === 0) return;

            const mentorTeamPromises = teams.map((team) =>
              fetchMockMentorTeams(id, team.id)
            );
            const mentorshipRequestPromises = teams.map((team) =>
              fetchMockMentorshipRequests(id, team.id)
            );

            const mentorTeamsResults = await Promise.all(mentorTeamPromises);
            const mentorshipRequestsResults = await Promise.all(
              mentorshipRequestPromises
            );

            const allMentorTeams = mentorTeamsResults.flat();
            const allMentorshipRequests = mentorshipRequestsResults.flat();

            setMentorTeams(allMentorTeams);
            setMentorshipRequests(allMentorshipRequests);

            if (allMentorTeams.length === 0) return;

            const mentorshipSessionPromises = allMentorTeams.map((mentorTeam) =>
              fetchMockMentorshipSessionRequests(mentorTeam.id)
            );
            const mentorshipSessionResults = await Promise.all(
              mentorshipSessionPromises
            );

            setMentorshipSessionRequests(mentorshipSessionResults.flat());
          };

          fetchUpdatedData();
        }}
      />
    </>
  );
}
