// src/app/[locale]/hackathon/[id]/_components/SessionRequestsTab.tsx
import { useState } from "react";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import SessionRequestForm from "./SessionRequestForm";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
      mentorTeamId?: string;
    }
  ) => Promise<{ success: boolean; message?: string }>;
};

export default function SessionRequestsTab({
  sessionRequests,
  onUpdateRequest,
}: SessionRequestsTabProps) {
  const t = useTranslations("sessionRequests");
  const toast = useToast();
  const [editingSession, setEditingSession] =
    useState<MentorshipSessionRequest | null>(null);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  const handleEdit = (session: MentorshipSessionRequest) => {
    setEditingSession(session);
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
  };

  const handleDelete = async (session: MentorshipSessionRequest) => {
    if (confirm(t("confirmCancel"))) {
      setLoadingSessionId(session.id);
      try {
        const { success, message } = await onUpdateRequest(session.id, {
          mentorTeamId: session.mentorTeamId,
          startTime: session.startTime,
          endTime: session.endTime,
          location: session.location,
          description: session.description,
          status: "DELETED",
        });

        if (success) {
          toast.success(message || t("cancelSuccess"));
        } else {
          toast.error(message || t("cancelError"));
        }
      } catch (error) {
        toast.error(t("cancelError"));
      } finally {
        setLoadingSessionId(null);
      }
    }
  };

  const handleUpdate = async (data: {
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  }) => {
    if (editingSession) {
      setLoadingSessionId(editingSession.id);
      try {
        const { success, message } = await onUpdateRequest(editingSession.id, {
          ...data,
          mentorTeamId: editingSession.mentorTeamId,
          status: editingSession.status,
        });

        if (success) {
          toast.success(message || t("updateSuccess"));
          setEditingSession(null);
        } else {
          toast.error(message || t("updateError"));
        }
      } catch (error) {
        toast.error(t("updateError"));
      } finally {
        setLoadingSessionId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="transition-colors duration-300">
      {editingSession && (
        <div className="mb-6 p-3 sm:p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300">
          <h3 className="font-bold mb-3 text-gray-900 dark:text-gray-100">
            {t("editRequest")}
          </h3>
          <SessionRequestForm
            initialData={{
              startTime: editingSession.startTime,
              endTime: editingSession.endTime,
              location: editingSession.location,
              description: editingSession.description,
            }}
            onSubmit={handleUpdate}
            onCancel={handleCancelEdit}
            isLoading={loadingSessionId === editingSession.id}
          />
        </div>
      )}

      {sessionRequests.length > 0 ? (
        <ul className="space-y-4">
          {sessionRequests.map((session) => (
            <li
              key={session.id}
              className="p-3 sm:p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="mb-3 sm:mb-0">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    {session.description}
                  </h3>

                  <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        📅
                      </span>
                      <span>
                        {formatDate(session.startTime)} {t("at")}{" "}
                        {formatTime(session.startTime)} -{" "}
                        {formatTime(session.endTime)}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        📍
                      </span>
                      <span>{session.location}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    session.status === "APPROVED"
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : session.status === "REJECTED"
                        ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        : session.status === "DELETED"
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          : session.status === "COMPLETED"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                  }`}
                >
                  {t(`status.${session.status.toLowerCase()}`)}
                </span>
              </div>

              {session.evaluatedBy && (
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2 transition-colors duration-300">
                  {t("evaluatedBy")}: {session.evaluatedBy.firstName}{" "}
                  {session.evaluatedBy.lastName}
                  <br />
                  {session.evaluatedAt &&
                    `${t("date")}: ${new Date(session.evaluatedAt).toLocaleString()}`}
                </div>
              )}

              <div className="mt-3 flex flex-wrap justify-end gap-2">
                {session.status === "PENDING" && (
                  <>
                    <button
                      className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-20"
                      onClick={() => handleDelete(session)}
                      disabled={loadingSessionId === session.id}
                      aria-label={t("cancel")}
                    >
                      {loadingSessionId === session.id ? (
                        <LoadingSpinner size="sm" className="text-white" />
                      ) : (
                        t("cancel")
                      )}
                    </button>
                    <button
                      className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleEdit(session)}
                      disabled={loadingSessionId === session.id}
                      aria-label={t("edit")}
                    >
                      {t("edit")}
                    </button>
                  </>
                )}
                {session.status === "APPROVED" && (
                  <button className="text-sm px-3 py-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded transition-colors duration-200">
                    {t("joinSession")}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400">{t("noRequests")}</p>
        </div>
      )}
    </div>
  );
}
