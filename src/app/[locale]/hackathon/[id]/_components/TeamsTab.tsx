// src/app/[locale]/hackathon/[id]/_components/TeamsTab.tsx
import { Team } from "@/types/entities/team";
import { useState } from "react";
import { ChevronRight, Users, CalendarClock, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApiModal } from "@/hooks/useApiModal";

type TeamsTabProps = {
  teams: Team[];
  onDataUpdate: () => void;
};

export default function TeamsTab({ teams, onDataUpdate }: TeamsTabProps) {
  const router = useRouter();
  const { showInfo } = useApiModal();
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const toggleTeamDetails = (teamId: string) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
    }
  };

  const goToTeamBoard = (teamId: string, hackathonId: string) => {
    router.push(`/hackathon/${hackathonId}/team/${teamId}/board`);
  };

  return (
    <div>
      <h4 className="font-medium mb-4">Your Teams</h4>
      {teams.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">
            You are not part of any teams for this hackathon.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Join a team or create a team request to participate with others.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {teams.map((team) => {
            const isExpanded = expandedTeamId === team.id;
            const hackathonId = team.teamHackathons[0]?.hackathonId;

            return (
              <li
                key={team.id}
                className="border rounded-lg hover:shadow-md transition-shadow overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer flex justify-between items-center bg-white"
                  onClick={() => toggleTeamDetails(team.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-lg">{team.name}</h5>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {team.teamHackathons[0]?.status || "Active"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{team.teamMembers.length} team members</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hackathonId) {
                          goToTeamBoard(team.id, hackathonId);
                        } else {
                          showInfo(
                            "Navigation Error",
                            "Could not find hackathon information for this team."
                          );
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 mr-3 rounded text-sm"
                    >
                      Go to Board
                    </button>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="font-medium text-sm mb-2 flex items-center">
                          <Users className="h-4 w-4 mr-1" /> Team Members
                        </h6>
                        <ul className="space-y-1">
                          {team.teamMembers.map((member) => (
                            <li key={member.id} className="text-sm">
                              <div className="flex items-center">
                                {member.user.id === team.teamLeader.id && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                                    Leader
                                  </span>
                                )}
                                <span>
                                  {member.user.firstName} {member.user.lastName}
                                </span>
                                <span className="text-gray-500 text-xs ml-1">
                                  ({member.user.email})
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h6 className="font-medium text-sm mb-2 flex items-center">
                          <CalendarClock className="h-4 w-4 mr-1" /> Team
                          Details
                        </h6>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(team.createdAt).toLocaleDateString()}
                          </li>
                          <li>
                            <span className="font-medium">Hackathon:</span>{" "}
                            {team.teamHackathons[0]?.hackathon?.title || "N/A"}
                          </li>
                          {team.project && (
                            <>
                              <li className="mt-2">
                                <h6 className="font-medium text-sm mb-1 flex items-center">
                                  <Award className="h-4 w-4 mr-1" /> Project
                                </h6>
                              </li>
                              <li>
                                <span className="font-medium">Name:</span>{" "}
                                {team.project.name}
                              </li>
                              {team.project.description && (
                                <li>
                                  <span className="font-medium">
                                    Description:
                                  </span>{" "}
                                  <p className="text-sm text-gray-600 mt-1">
                                    {team.project.description}
                                  </p>
                                </li>
                              )}
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
