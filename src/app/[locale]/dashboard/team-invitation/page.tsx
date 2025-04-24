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
  const { modalState, showError, showSuccess, hideModal } = useApiModal();

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
      showError(
        "Error",
        "Failed to fetch team invitations. Please try again later."
      );
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
      showError(
        "Error",
        "Failed to fetch registration status. Please try again later."
      );
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

    setIsLoading(true);
    try {
      // Call real API to update status
      const { data, message } =
        await teamRequestMemberService.respondToTeamRequest({
          requestId: teamRequestId,
          userId: userId,
          status,
          note:
            status === "APPROVED"
              ? "Invitation accepted"
              : "Invitation declined",
        });

      // Show success message
      showSuccess(
        status === "APPROVED" ? "Invitation Accepted" : "Invitation Declined",
        message ||
          `You have ${status === "APPROVED" ? "accepted" : "declined"} the team invitation.`
      );

      // Refresh data to show updated status
      fetchTeamRequests();
      fetchIndividualRegistrations();
    } catch (error: any) {
      console.error("Failed to update status:", error);
      showError(
        "Action Failed",
        error.message ||
          "Failed to respond to invitation. Please try again later."
      );
    } finally {
      setIsLoading(false);
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
        ? "You have already joined another team for this hackathon"
        : hasIndividualRegistration
          ? "You have already registered individually for this hackathon"
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading your invitations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <div className="mt-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Team Invitations</h1>

        {Object.entries(groupedRequests).length > 0 ? (
          Object.entries(groupedRequests).map(
            ([hackathonId, { title, requests }]) => {
              const { canAcceptTeamRequests, reason } =
                checkUserParticipationStatus(hackathonId);

              return (
                <div
                  key={hackathonId}
                  className="mb-4 bg-white rounded-lg shadow p-4"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(hackathonId)}
                  >
                    <h2 className="text-xl font-semibold">{title}</h2>
                    {expandedHackathons[hackathonId] ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>

                  {expandedHackathons[hackathonId] && (
                    <div className="mt-3 space-y-3">
                      {requests.map((request) => (
                        <div
                          key={request.id}
                          className="border rounded-lg p-3 bg-gray-50"
                        >
                          <p className="text-gray-800">
                            <strong>Note:</strong> {request.note}
                          </p>
                          <p className="text-gray-600">
                            <strong>Status:</strong> {request.status}
                          </p>
                          <p className="text-gray-600">
                            <strong>Deadline:</strong>{" "}
                            {new Date(
                              request.confirmationDeadline
                            ).toLocaleString()}
                          </p>
                          <p className="text-gray-600">
                            <strong>Created By:</strong>{" "}
                            {request.createdByUserName}
                          </p>
                          <div className="mt-2">
                            <strong>Team Members:</strong>
                            <ul className="list-disc ml-4 text-gray-700">
                              {request.teamRequestMembers.map((member) => {
                                const isCurrentUser =
                                  member.user?.id === user?.id;
                                const isPending =
                                  member.status === "PENDING" ||
                                  member.status === "pending";

                                return (
                                  <li key={member.id} className="py-1">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        {member.user?.firstName}{" "}
                                        {member.user?.lastName} -{" "}
                                        <span
                                          className={
                                            member.status === "APPROVED" ||
                                            member.status === "approved"
                                              ? "text-green-600"
                                              : member.status === "REJECTED" ||
                                                  member.status === "rejected"
                                                ? "text-red-600"
                                                : "text-yellow-600"
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
                                              isLoading
                                            }
                                            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-white ${
                                              canAcceptTeamRequests &&
                                              !isLoading
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                            title={
                                              !canAcceptTeamRequests
                                                ? reason
                                                : "Accept invitation"
                                            }
                                          >
                                            <Check size={16} />
                                            <span>Accept</span>
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleStatusUpdate(
                                                request.id,
                                                user.id,
                                                "REJECTED"
                                              )
                                            }
                                            disabled={isLoading}
                                            className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-white"
                                          >
                                            <X size={16} />
                                            <span>Reject</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    {isCurrentUser &&
                                      isPending &&
                                      !canAcceptTeamRequests && (
                                        <div className="mt-1 text-sm text-red-500">
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
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-600">
            You don't have any team invitations yet.
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
