// src/app/[locale]/hackathon/[id]/_components/RequestMentorTab.tsx
import { useState } from "react";
import Image from "next/image";
import { User } from "@/types/entities/user";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type RequestMentorTabProps = {
  mentors: User[];
  loading: boolean;
  onRequestMentorship: (
    mentorId: string
  ) => Promise<{ success: boolean; message?: string }>;
};

export default function RequestMentorTab({
  mentors,
  loading,
  onRequestMentorship,
}: RequestMentorTabProps) {
  const t = useTranslations("requestMentor");
  const toast = useToast();
  const [requestingMentorId, setRequestingMentorId] = useState<string | null>(
    null
  );

  const handleRequestMentorship = async (mentorId: string) => {
    try {
      setRequestingMentorId(mentorId);
      const { success, message } = await onRequestMentorship(mentorId);

      if (success) {
        toast.success(message || t("requestSuccess"));
      } else {
        toast.error(message || t("requestError"));
      }
    } catch (error) {
      toast.error(t("requestError"));
    } finally {
      setRequestingMentorId(null);
    }
  };

  return (
    <div className="transition-colors duration-300">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner
            size="md"
            showText={true}
            className="text-blue-500 dark:text-blue-400"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mentors.map((mentor) => {
            const currentTeamCount = mentor.mentorTeams?.length || 0;
            const maxTeamLimit = mentor.mentorTeamLimits?.length || 5;
            const full = currentTeamCount >= maxTeamLimit;

            return (
              <div
                key={mentor.id}
                className={`border rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
                  full ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={mentor.avatarUrl || "/placeholder-avatar.png"}
                      alt={`${mentor.firstName} ${mentor.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    {mentor.university && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {mentor.university}
                      </p>
                    )}
                  </div>
                </div>

                {mentor.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mt-3 text-sm line-clamp-3">
                    {mentor.bio}
                  </p>
                )}

                {mentor.skills && mentor.skills.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {mentor.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300 transition-colors duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm flex gap-2">
                    {mentor.linkedinUrl && (
                      <a
                        href={mentor.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                        aria-label={`${mentor.firstName}'s LinkedIn`}
                      >
                        LinkedIn
                      </a>
                    )}
                    {mentor.githubUrl && (
                      <a
                        href={mentor.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors duration-200"
                        aria-label={`${mentor.firstName}'s GitHub`}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                  <div className="text-sm">
                    <span
                      className={
                        full
                          ? "text-red-500 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }
                    >
                      {currentTeamCount}/{maxTeamLimit}
                    </span>{" "}
                    {t("teams")}
                  </div>
                </div>

                <button
                  disabled={full || requestingMentorId === mentor.id}
                  onClick={() => !full && handleRequestMentorship(mentor.id)}
                  className={`mt-3 w-full py-2 rounded text-sm font-medium transition-colors duration-200 ${
                    full
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={
                    full ? t("mentorAtCapacity") : t("requestMentorship")
                  }
                >
                  {requestingMentorId === mentor.id ? (
                    <div className="flex justify-center items-center">
                      <LoadingSpinner size="sm" className="text-white" />
                    </div>
                  ) : full ? (
                    t("mentorAtCapacity")
                  ) : (
                    t("requestMentorship")
                  )}
                </button>
              </div>
            );
          })}

          {mentors.length === 0 && !loading && (
            <div className="col-span-1 sm:col-span-2 text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <p className="text-gray-500 dark:text-gray-400">
                {t("noMentorsAvailable")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
