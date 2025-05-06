// src/app/[locale]/hackathon/[id]/_components/MentorshipRequestsTab.tsx
import { useState } from "react";
import Image from "next/image";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type MentorshipRequestsTabProps = {
  mentorshipRequests: MentorshipRequest[];
  onDeleteRequest: (requestId: string) => Promise<void>;
};

export default function MentorshipRequestsTab({
  mentorshipRequests,
  onDeleteRequest,
}: MentorshipRequestsTabProps) {
  const t = useTranslations("mentorshipRequests");
  const toast = useToast();
  const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null);

  const handleDeleteRequest = async (requestId: string) => {
    try {
      setLoadingRequestId(requestId);
      await onDeleteRequest(requestId);
      // If we get here, the operation succeeded as errors would be caught and handled in the parent
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Error in handleDeleteRequest:", error);
    } finally {
      setLoadingRequestId(null);
    }
  };

  return (
    <div className="transition-colors duration-300">
      {mentorshipRequests.length > 0 ? (
        <ul className="space-y-4">
          {mentorshipRequests.map((request) => (
            <li
              key={request.id}
              className="p-3 sm:p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm transition-all duration-300 hover:shadow-md border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={
                        request.mentor.avatarUrl || "/placeholder-avatar.png"
                      }
                      alt={`${request.mentor.firstName} ${request.mentor.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      {request.mentor.firstName} {request.mentor.lastName}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          request.status === "APPROVED"
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : request.status === "REJECTED"
                              ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                              : request.status === "DELETED"
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {t(`status.${request.status.toLowerCase()}`)}
                      </span>
                    </div>
                  </div>
                </div>

                {request.status === "PENDING" && (
                  <button
                    onClick={() => handleDeleteRequest(request.id)}
                    disabled={loadingRequestId === request.id}
                    className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-24"
                    aria-label={t("cancelRequest")}
                  >
                    {loadingRequestId === request.id ? (
                      <LoadingSpinner size="sm" className="text-white" />
                    ) : (
                      t("cancelRequest")
                    )}
                  </button>
                )}
              </div>

              <div className="mt-3 text-sm">
                <div className="flex flex-wrap gap-1 mt-1">
                  {request.mentor.skills &&
                    request.mentor.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300 transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              {request.evaluatedBy && (
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2 transition-colors duration-300">
                  {t("evaluatedBy")}: {request.evaluatedBy.firstName}{" "}
                  {request.evaluatedBy.lastName}
                  <br />
                  {request.evaluatedAt &&
                    `${t("date")}: ${new Date(request.evaluatedAt).toLocaleString()}`}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400">{t("noRequests")}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {t("requestFromTab")}
          </p>
        </div>
      )}
    </div>
  );
}
