// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/RewardListTab.tsx
"use client";

import { useEffect, useState } from "react";
import { HackathonResult } from "@/types/entities/hackathonResult";
import { hackathonResultService } from "@/services/hackathonResult.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

interface RewardListTabProps {
  hackathonId: string;
}

export default function RewardListTab({ hackathonId }: RewardListTabProps) {
  const [results, setResults] = useState<HackathonResult[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("hackathonResults");
  const toast = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data, message } =
          await hackathonResultService.getHackathonResultsByHackathonId(
            hackathonId
          );

        if (data && data.length > 0) {
          // Sort results by totalScore (highest to lowest)
          const sortedResults = [...data].sort(
            (a, b) => b.totalScore - a.totalScore
          );
          setResults(sortedResults);
          toast.success(message || t("fetchSuccess"));
        } else {
          setResults([]);
          toast.info(message || t("noResults"));
        }
      } catch (err) {
        console.error("Error fetching hackathon results:", err);
        toast.error(err instanceof Error ? err.message : t("fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    // Don't include toast in dependencies to avoid infinite loops
  }, [hackathonId, t]);

  const getPlacementClass = (placement: number) => {
    switch (placement) {
      case 1:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case 2:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case 3:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-200">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
        {t("title")}
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" showText />
        </div>
      ) : results.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-300">
            {t("noResultsAvailable")}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
            {t("resultsAfterJudging")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 transition-colors duration-200">
                <tr>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("placement")}
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("team")}
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    {t("teamLead")}
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                    {t("members")}
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("score")}
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("award")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 transition-colors duration-200">
                {results.map((result) => (
                  <tr
                    key={result.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${getPlacementClass(result.placement)} transition-colors duration-200`}
                        >
                          {result.placement}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base transition-colors duration-200">
                        {result.team?.name || t("unknownTeam")}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap hidden md:table-cell">
                      {result.team?.teamLeader ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden transition-colors duration-200">
                            {result.team.teamLeader.avatarUrl && (
                              <Image
                                src={result.team.teamLeader.avatarUrl}
                                alt={`${result.team.teamLeader.firstName} ${result.team.teamLeader.lastName}`}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="text-sm text-gray-900 dark:text-white transition-colors duration-200">{`${result.team.teamLeader.firstName} ${result.team.teamLeader.lastName}`}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                              {result.team.teamLeader.email}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                          {t("notAvailable")}
                        </span>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
                      {result.team?.teamMembers?.length ? (
                        <div className="flex flex-col space-y-1">
                          {result.team.teamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
                            >
                              {`${member.user.firstName} ${member.user.lastName}`}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm transition-colors duration-200">
                          {t("noAdditionalMembers")}
                        </span>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base transition-colors duration-200">
                        {result.totalScore?.toFixed(1) || 0}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 transition-colors duration-200">
                        {result.award || t("noAward")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
