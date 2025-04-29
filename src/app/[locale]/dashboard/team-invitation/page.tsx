// src/app/[locale]/dashboard/team-invitation/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { TeamRequest } from "@/types/entities/teamRequest";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { teamRequestService } from "@/services/teamRequest.service";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { teamRequestMemberService } from "@/services/teamRequestMember.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function TeamInvitationPage() {
  const { user } = useAuth();
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [individualRegistrations, setIndividualRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [expandedHackathons, setExpandedHackathons] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { modalState, showError, showSuccess, hideModal } = useApiModal();
  const toast = useToast();
  const t = useTranslations("teamInvitation");

  const fetchTeamRequests = async () => {
    if (!user || !user.id) return;

    try {
      setIsLoading(true);
      const { data, message } = await teamRequestService.getTeamRequestsByUser(
        user.id
      );
      setTeamRequests(data);
    } catch (error) {
      console.error("Failed to fetch team requests:", error);
      showError(t("error"), t("failedToFetchInvitations"));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIndividualRegistrations = async () => {
    if (!user || !user.username) return;

    try {
      setIsLoading(true);
      const { data, message } =
        await individualRegistrationRequestService.getIndividualRegistrationRequestsByUser(
          user.username
        );
      setIndividualRegistrations(data);
    } catch (error) {
      console.error("Failed to fetch individual registrations:", error);
      showError(t("error"), t("failedToFetchRegistrationStatus"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTeamRequests();
      fetchIndividualRegistrations();
    }
  }, [user]);

  const toggleExpand = (hackathonId: string) => {
    setExpandedHackathons((prev) => ({
      ...prev,
      [hackathonId]: !prev[hackathonId],
    }));
  };

  const handleStatusUpdate = async (
    teamRequestId: string,
    userId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    if (!user || !user.id) return;

    setIsSubmitting(true);
    try {
      // Toast loading state for better UX
      toast.info(
        status === "APPROVED"
          ? t("acceptingInvitation")
          : t("decliningInvitation")
      );

      // Call real API to update status
      const { data, message } =
        await teamRequestMemberService.respondToTeamRequest({
          requestId: teamRequestId,
          userId: userId,
          status,
          note:
            status === "APPROVED"
              ? t("invitationAccepted")
              : t("invitationDeclined"),
        });

      // Show success toast with the API response message
      toast.success(
        status === "APPROVED"
          ? t("invitationAcceptedSuccess")
          : t("invitationDeclinedSuccess")
      );

      // Show success message in modal
      showSuccess(
        status === "APPROVED"
          ? t("invitationAccepted")
          : t("invitationDeclined"),
        message ||
          `${status === "APPROVED" ? t("youHaveAccepted") : t("youHaveDeclined")}`
      );

      // Refresh data to show updated status
      fetchTeamRequests();
      fetchIndividualRegistrations();
    } catch (error: any) {
      console.error("Failed to update status:", error);

      // Show error toast with API error message
      toast.error(error.message || t("failedToRespond"));

      showError(t("actionFailed"), error.message || t("failedToRespond"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user already has an approved request for a hackathon
  const checkUserParticipationStatus = (hackathonId: string) => {
    // Check if user already has an approved team member request for this hackathon
    const hasApprovedTeamRequest = teamRequests.some(
      (request) =>
        request.hackathon?.id === hackathonId &&
        request.teamRequestMembers.some(
          (member) =>
            member.user?.id === user?.id && member.status === "APPROVED"
        )
    );

    // Check if user already has a pending or approved individual registration for this hackathon
    const hasIndividualRegistration = individualRegistrations.some(
      (reg) =>
        reg.hackathon?.id === hackathonId &&
        (reg.status === "PENDING" || reg.status === "APPROVED")
    );

    return {
      canAcceptTeamRequests:
        !hasApprovedTeamRequest && !hasIndividualRegistration,
      reason: hasApprovedTeamRequest
        ? t("alreadyJoinedAnotherTeam")
        : hasIndividualRegistration
          ? t("alreadyRegisteredIndividually")
          : "",
    };
  };

  // Group team requests by hackathon
  const groupedRequests = teamRequests.reduce(
    (acc, request) => {
      if (!request.hackathon) return acc;
      const hackathonId = request.hackathon.id;
      if (!acc[hackathonId]) {
        acc[hackathonId] = { title: request.hackathon.title, requests: [] };
      }
      acc[hackathonId].requests.push(request);
      return acc;
    },
    {} as Record<string, { title: string; requests: TeamRequest[] }>
  );

  // Loading state UI
  if (isLoading && teamRequests.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
        <div className="text-center">
          <LoadingSpinner size="lg" showText={true} />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {t("loadingInvitations")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="mt-6 w-full max-w-3xl px-4 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          {t("teamInvitations")}
        </h1>

        {Object.entries(groupedRequests).length > 0 ? (
          Object.entries(groupedRequests).map(
            ([hackathonId, { title, requests }]) => {
              const { canAcceptTeamRequests, reason } =
                checkUserParticipationStatus(hackathonId);

              return (
                <div
                  key={hackathonId}
                  className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 transition-colors duration-300"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(hackathonId)}
                  >
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                      {title}
                    </h2>
                    <div className="text-gray-600 dark:text-gray-300">
                      {expandedHackathons[hackathonId] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  {expandedHackathons[hackathonId] && (
                    <div className="mt-3 space-y-3">
                      {requests.map((request) => (
                        <div
                          key={request.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 transition-colors duration-300"
                        >
                          <p className="text-gray-800 dark:text-gray-200">
                            <strong>{t("note")}:</strong> {request.note}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <strong>{t("status")}:</strong> {request.status}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <strong>{t("deadline")}:</strong>{" "}
                            {new Date(
                              request.confirmationDeadline
                            ).toLocaleString()}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <strong>{t("createdBy")}:</strong>{" "}
                            {request.createdByUserName}
                          </p>
                          <div className="mt-2">
                            <strong>{t("teamMembers")}:</strong>
                            <ul className="list-disc ml-4 text-gray-700 dark:text-gray-300">
                              {request.teamRequestMembers.map((member) => {
                                const isCurrentUser =
                                  member.user?.id === user?.id;
                                const isPending =
                                  member.status === "PENDING" ||
                                  member.status === "pending";

                                return (
                                  <li key={member.id} className="py-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                      <div className="mb-2 sm:mb-0">
                                        {member.user?.firstName}{" "}
                                        {member.user?.lastName} -{" "}
                                        <span
                                          className={
                                            member.status === "APPROVED" ||
                                            member.status === "approved"
                                              ? "text-green-600 dark:text-green-400"
                                              : member.status === "REJECTED" ||
                                                  member.status === "rejected"
                                                ? "text-red-600 dark:text-red-400"
                                                : "text-yellow-600 dark:text-yellow-400"
                                          }
                                        >
                                          {member.status}
                                        </span>
                                      </div>

                                      {isCurrentUser && isPending && (
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() =>
                                              handleStatusUpdate(
                                                request.id,
                                                user.id,
                                                "APPROVED"
                                              )
                                            }
                                            disabled={
                                              !canAcceptTeamRequests ||
                                              isSubmitting
                                            }
                                            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-white transition-colors duration-200 ${
                                              canAcceptTeamRequests &&
                                              !isSubmitting
                                                ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                                : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                            }`}
                                            title={
                                              !canAcceptTeamRequests
                                                ? reason
                                                : t("acceptInvitation")
                                            }
                                          >
                                            <Check size={16} />
                                            <span>{t("accept")}</span>
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleStatusUpdate(
                                                request.id,
                                                user.id,
                                                "REJECTED"
                                              )
                                            }
                                            disabled={isSubmitting}
                                            className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-md text-white transition-colors duration-200"
                                          >
                                            <X size={16} />
                                            <span>{t("reject")}</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    {isCurrentUser &&
                                      isPending &&
                                      !canAcceptTeamRequests && (
                                        <div className="mt-1 text-sm text-red-500 dark:text-red-400">
                                          {reason}
                                        </div>
                                      )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
            {t("noInvitations")}
          </div>
        )}
      </div>

      {/* API Response Modal */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
