// src/app/[locale]/hackathon/[id]/_components/MentorTeamsTab.tsx
import { useState } from "react";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import SessionRequestForm from "./SessionRequestForm";

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
  const [showForm, setShowForm] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const handleRequestSession = (teamId: string) => {
    setSelectedTeamId(teamId);
    setShowForm(true);
  };

  const handleSubmit = async (data: {
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  }) => {
    await onCreateSessionRequest({
      ...data,
      mentorTeamId: selectedTeamId,
    });
    setShowForm(false);
  };

  // Get session requests for a specific mentor team
  const getSessionRequestsForMentorTeam = (mentorTeamId: string) => {
    return mentorshipSessionRequests.filter(
      (session) => session.mentorTeam?.id === mentorTeamId
    );
  };

  return (
    <div>
      {showForm && (
        <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
          <h3 className="font-bold mb-3">Request a New Session</h3>
          <SessionRequestForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {mentorTeams.length > 0 ? (
        <ul className="space-y-4">
          {mentorTeams.map((mentorTeam) => {
            const teamSessionRequests = getSessionRequestsForMentorTeam(
              mentorTeam.id
            );

            return (
              <li
                key={mentorTeam.id}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={
                      mentorTeam.mentor.avatarUrl || "/placeholder-avatar.png"
                    }
                    alt={`${mentorTeam.mentor.firstName} ${mentorTeam.mentor.lastName}`}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <h3 className="font-bold">
                      {mentorTeam.mentor.firstName} {mentorTeam.mentor.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {mentorTeam.mentor.email}
                    </p>
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="font-semibold text-sm text-gray-700">
                    Session Requests:
                  </h4>
                  {teamSessionRequests && teamSessionRequests.length > 0 ? (
                    <ul className="mt-1 space-y-2">
                      {teamSessionRequests.map((session) => (
                        <li
                          key={session.id}
                          className="text-sm p-2 bg-white rounded border"
                        >
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {session.description}
                            </div>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                session.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : session.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {session.status}
                            </span>
                          </div>
                          <div className="mt-1 text-gray-600">
                            📅 {new Date(session.startTime).toLocaleString()} -{" "}
                            {new Date(session.endTime).toLocaleString()}
                          </div>
                          <div className="text-gray-600">
                            📍 {session.location}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      No session requests yet
                    </p>
                  )}
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleRequestSession(mentorTeam.id)}
                  >
                    Request Session
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No assigned mentors yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Request a mentor from the "Request a Mentor" tab
          </p>
        </div>
      )}
    </div>
  );
}
