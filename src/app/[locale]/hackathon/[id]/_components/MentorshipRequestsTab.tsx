// src/app/[locale]/hackathon/[id]/_components/MentorshipRequestsTab.tsx
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";

type MentorshipRequestsTabProps = {
  mentorshipRequests: MentorshipRequest[];
  onDeleteRequest: (requestId: string) => Promise<void>;
};

export default function MentorshipRequestsTab({
  mentorshipRequests,
  onDeleteRequest,
}: MentorshipRequestsTabProps) {
  return (
    <div>
      {mentorshipRequests.length > 0 ? (
        <ul className="space-y-4">
          {mentorshipRequests.map((request) => (
            <li
              key={request.id}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={request.mentor.avatarUrl || "/placeholder-avatar.png"}
                    alt={`${request.mentor.firstName} ${request.mentor.lastName}`}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <h3 className="font-bold">
                      {request.mentor.firstName} {request.mentor.lastName}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          request.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : request.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : request.status === "DELETED"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>

                {request.status === "PENDING" && (
                  <button
                    onClick={() => onDeleteRequest(request.id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel Request
                  </button>
                )}
              </div>

              <div className="mt-3 text-sm">
                <div className="flex flex-wrap gap-1 mt-1">
                  {request.mentor.skills &&
                    request.mentor.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              {request.evaluatedBy && (
                <div className="mt-3 text-xs text-gray-500 border-t pt-2">
                  Evaluated by: {request.evaluatedBy.firstName}{" "}
                  {request.evaluatedBy.lastName}
                  <br />
                  {request.evaluatedAt &&
                    `Date: ${new Date(request.evaluatedAt).toLocaleString()}`}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No pending mentorship requests.</p>
          <p className="text-sm text-gray-400 mt-2">
            Request a mentor from the "Request a Mentor" tab
          </p>
        </div>
      )}
    </div>
  );
}
