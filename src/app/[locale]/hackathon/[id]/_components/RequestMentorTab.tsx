// src/app/[locale]/hackathon/[id]/_components/RequestMentorTab.tsx
import { User } from "@/types/entities/user";

type RequestMentorTabProps = {
  mentors: User[];
  loading: boolean;
  onRequestMentorship: (mentorId: string) => Promise<void>;
};

export default function RequestMentorTab({
  mentors,
  loading,
  onRequestMentorship,
}: RequestMentorTabProps) {
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                className={`border rounded-lg p-4 shadow-sm ${
                  full ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={mentor.avatarUrl || "/placeholder-avatar.png"}
                    alt={`${mentor.firstName} ${mentor.lastName}`}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <h3 className="font-bold">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    {mentor.university && (
                      <p className="text-gray-600 text-sm">
                        {mentor.university}
                      </p>
                    )}
                  </div>
                </div>

                {mentor.bio && (
                  <p className="text-gray-700 mt-3 text-sm line-clamp-3">
                    {mentor.bio}
                  </p>
                )}

                {mentor.skills && mentor.skills.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {mentor.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 rounded text-xs"
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
                        className="text-blue-500 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                    {mentor.githubUrl && (
                      <a
                        href={mentor.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className={full ? "text-red-500" : "text-green-600"}>
                      {currentTeamCount}/{maxTeamLimit}
                    </span>{" "}
                    teams
                  </div>
                </div>

                <button
                  disabled={full}
                  onClick={() => !full && onRequestMentorship(mentor.id)}
                  className={`mt-3 w-full py-2 rounded text-sm font-medium ${
                    full
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {full ? "Mentor at capacity" : "Request Mentorship"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
