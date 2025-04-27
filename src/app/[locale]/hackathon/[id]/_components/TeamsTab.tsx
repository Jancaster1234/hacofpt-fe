// src/app/[locale]/hackathon/[id]/_components/TeamsTab.tsx
import { Team } from "@/types/entities/team";
import { useState } from "react";
import { ChevronRight, Users, CalendarClock, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "@/hooks/useTranslations";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type TeamsTabProps = {
  teams: Team[];
  onDataUpdate: () => void;
};

export default function TeamsTab({ teams, onDataUpdate }: TeamsTabProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const t = useTranslations("teams");
  const toast = useToast();
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleTeamDetails = (teamId: string) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
    }
  };

  const goToTeamBoard = async (teamId: string, hackathonId: string) => {
    try {
      setIsLoading(true);
      // Navigation is already handled by Next.js router
      router.push(`/hackathon/${hackathonId}/team/${teamId}/board`);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error(t("navigationError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transition-colors duration-300">
      <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-200">
        {t("yourTeams")}
      </h4>
      {isLoading && (
        <div className="flex justify-center my-4">
          <LoadingSpinner size="md" showText={true} />
        </div>
      )}
      {teams.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">{t("noTeams")}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("joinOrCreateTeam")}
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
                className="border dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-gray-800 transition-all overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-900 transition-colors duration-300"
                  onClick={() => toggleTeamDetails(team.id)}
                >
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h5 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                        {team.name}
                      </h5>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        {t(
                          `status.${team.teamHackathons[0]?.status?.toLowerCase() || "active"}`
                        )}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span>
                        {t("membersCount", { count: team.teamMembers.length })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hackathonId) {
                          goToTeamBoard(team.id, hackathonId);
                        } else {
                          toast.error(t("hackathonInfoError"));
                        }
                      }}
                      disabled={isLoading}
                      className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1 mr-3 rounded text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={t("goToBoard")}
                    >
                      {t("goToBoard")}
                    </button>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 transition-colors duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="font-medium text-sm mb-2 flex items-center text-gray-700 dark:text-gray-300">
                          <Users className="h-4 w-4 mr-1" /> {t("teamMembers")}
                        </h6>
                        <ul className="space-y-1">
                          {team.teamMembers.map((member) => (
                            <li key={member.id} className="text-sm">
                              <div className="flex items-center flex-wrap">
                                {member.user.id === team.teamLeader.id && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 mr-2">
                                    {t("leader")}
                                  </span>
                                )}
                                <span className="text-gray-800 dark:text-gray-200">
                                  {member.user.firstName} {member.user.lastName}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                                  ({member.user.email})
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h6 className="font-medium text-sm mb-2 flex items-center text-gray-700 dark:text-gray-300">
                          <CalendarClock className="h-4 w-4 mr-1" />{" "}
                          {t("teamDetails")}
                        </h6>
                        <ul className="space-y-1 text-sm">
                          <li className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">{t("created")}:</span>{" "}
                            {new Date(team.createdAt).toLocaleDateString()}
                          </li>
                          <li className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">
                              {t("hackathon")}:
                            </span>{" "}
                            {team.teamHackathons[0]?.hackathon?.title ||
                              t("notAvailable")}
                          </li>
                          {team.project && (
                            <>
                              <li className="mt-2">
                                <h6 className="font-medium text-sm mb-1 flex items-center text-gray-700 dark:text-gray-300">
                                  <Award className="h-4 w-4 mr-1" />{" "}
                                  {t("project")}
                                </h6>
                              </li>
                              <li className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">
                                  {t("projectName")}:
                                </span>{" "}
                                {team.project.name}
                              </li>
                              {team.project.description && (
                                <li className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">
                                    {t("description")}:
                                  </span>{" "}
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
