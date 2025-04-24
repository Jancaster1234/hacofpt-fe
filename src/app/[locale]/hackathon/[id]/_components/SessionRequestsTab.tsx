// src/app/[locale]/hackathon/[id]/_components/SessionRequestsTab.tsx
import { useState } from "react";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import SessionRequestForm from "./SessionRequestForm";

type SessionRequestsTabProps = {
  sessionRequests: MentorshipSessionRequest[];
  onUpdateRequest: (
    sessionId: string,
    data: {
      startTime?: string;
      endTime?: string;
      location?: string;
      description?: string;
      status?: "PENDING" | "DELETED";
    }
  ) => Promise<void>;
};

export default function SessionRequestsTab({
  sessionRequests,
  onUpdateRequest,
}: SessionRequestsTabProps) {
  const [editingSession, setEditingSession] =
    useState<MentorshipSessionRequest | null>(null);

  const handleEdit = (session: MentorshipSessionRequest) => {
    setEditingSession(session);
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
  };

  const handleDelete = async (session: MentorshipSessionRequest) => {
    if (confirm("Are you sure you want to cancel this session request?")) {
      await onUpdateRequest(session.id, {
        mentorTeamId: session.mentorTeamId,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        description: session.description,
        status: "DELETED",
      });
    }
  };

  const handleUpdate = async (data: {
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  }) => {
    if (editingSession) {
      await onUpdateRequest(editingSession.id, {
        ...data,
        mentorTeamId: editingSession.mentorTeamId,
        status: editingSession.status, // Maintain the current status unless you want to change it
      });
      setEditingSession(null);
    }
  };

  return (
    <div>
      {editingSession && (
        <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
          <h3 className="font-bold mb-3">Edit Session Request</h3>
          <SessionRequestForm
            initialData={{
              startTime: editingSession.startTime,
              endTime: editingSession.endTime,
              location: editingSession.location,
              description: editingSession.description,
            }}
            onSubmit={handleUpdate}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {sessionRequests.length > 0 ? (
        <ul className="space-y-4">
          {sessionRequests.map((session) => (
            <li
              key={session.id}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{session.description}</h3>

                  <div className="mt-2 space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="text-gray-600">📅</span>
                      <span>
                        {new Date(session.startTime).toLocaleDateString()} at{" "}
                        {new Date(session.startTime).toLocaleTimeString()} -{" "}
                        {new Date(session.endTime).toLocaleTimeString()}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-600">📍</span>
                      <span>{session.location}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    session.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : session.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : session.status === "DELETED"
                          ? "bg-gray-100 text-gray-700"
                          : session.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {session.status}
                </span>
              </div>

              {session.evaluatedBy && (
                <div className="mt-3 text-xs text-gray-500 border-t pt-2">
                  Evaluated by: {session.evaluatedBy.firstName}{" "}
                  {session.evaluatedBy.lastName}
                  <br />
                  {session.evaluatedAt &&
                    `Date: ${new Date(session.evaluatedAt).toLocaleString()}`}
                </div>
              )}

              <div className="mt-3 flex justify-end gap-2">
                {session.status === "PENDING" && (
                  <>
                    <button
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(session)}
                    >
                      Cancel
                    </button>
                    <button
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handleEdit(session)}
                    >
                      Edit
                    </button>
                  </>
                )}
                {session.status === "APPROVED" && (
                  <button className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    Join Session
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No session requests yet.</p>
        </div>
      )}
    </div>
  );
}
