// src/app/[locale]/hackathon/[id]/_components/MentorshipModal.tsx
import { Dialog, Tab } from "@headlessui/react";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import { User } from "@/types/entities/user";
import { useEffect, useState } from "react";
import MentorTeamsTab from "./MentorTeamsTab";
import MentorshipRequestsTab from "./MentorshipRequestsTab";
import SessionRequestsTab from "./SessionRequestsTab";
import RequestMentorTab from "./RequestMentorTab";
import { useApiModal } from "@/hooks/useApiModal";

// Import real services instead of mock API functions
import { mentorshipRequestService } from "@/services/mentorshipRequest.service";
import { mentorshipSessionRequestService } from "@/services/mentorshipSessionRequest.service";
import { userHackathonService } from "@/services/userHackathon.service";

type MentorshipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mentorTeams: MentorTeam[];
  mentorshipRequests: MentorshipRequest[];
  mentorshipSessionRequests: MentorshipSessionRequest[];
  hackathonId: string;
  teamId: string; // Added teamId for creating requests
  onDataUpdate: () => void; // Callback to refresh parent data
};

export default function MentorshipModal({
  isOpen,
  onClose,
  mentorTeams,
  mentorshipRequests,
  mentorshipSessionRequests,
  hackathonId,
  teamId,
  onDataUpdate,
}: MentorshipModalProps) {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Use our API modal hook for error and success handling
  const { modalState, hideModal, showError, showSuccess, showInfo } =
    useApiModal();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);

      // Replace mock mentor fetching with real service call
      // Assuming mentors have a specific role in user-hackathon relationship
      userHackathonService
        .getUserHackathonsByRole(hackathonId, "MENTOR")
        .then((response) => {
          if (response.data) {
            // Assuming userHackathon contains user data or we need to extract userIds
            // and fetch user details separately
            const mentorUsers = response.data.map(
              (userHackathon) => userHackathon.user
            ) as User[];
            setMentors(mentorUsers);
          } else {
            showError("Error", "Failed to load mentors");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch mentors:", error);
          showError("Error", "Failed to load mentors. Please try again later.");
        })
        .finally(() => setLoading(false));
    }
  }, [hackathonId, isOpen, showError]);

  // Handler for creating a new mentorship request
  const handleCreateMentorshipRequest = async (mentorId: string) => {
    try {
      const response = await mentorshipRequestService.createMentorshipRequest({
        hackathonId,
        mentorId,
        teamId,
        status: "PENDING",
      });

      if (response.data && response.data.id) {
        showSuccess("Success", "Mentorship request created successfully");
        onDataUpdate(); // Refresh data after successful creation
      } else {
        showError(
          "Error",
          response.message || "Failed to create mentorship request"
        );
      }
    } catch (error) {
      console.error("Failed to create mentorship request:", error);
      showError(
        "Error",
        "Failed to create mentorship request. Please try again later."
      );
    }
  };

  // Handler for deleting a mentorship request
  const handleDeleteMentorshipRequest = async (requestId: string) => {
    try {
      const response =
        await mentorshipRequestService.deleteMentorshipRequest(requestId);

      if (response.message) {
        showSuccess("Success", "Mentorship request deleted successfully");
        onDataUpdate(); // Refresh data after successful deletion
      } else {
        showError("Error", "Failed to delete mentorship request");
      }
    } catch (error) {
      console.error("Failed to delete mentorship request:", error);
      showError(
        "Error",
        "Failed to delete mentorship request. Please try again later."
      );
    }
  };

  // Handler for creating a new session request
  const handleCreateSessionRequest = async (data: {
    mentorTeamId: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  }) => {
    try {
      const response =
        await mentorshipSessionRequestService.createMentorshipSessionRequest({
          ...data,
          status: "PENDING", // Using proper status case according to your service
        });

      if (response.data && response.data.id) {
        showSuccess("Success", "Session request created successfully");
        onDataUpdate(); // Refresh data after successful creation
      } else {
        showError(
          "Error",
          response.message || "Failed to create session request"
        );
      }
    } catch (error) {
      console.error("Failed to create session request:", error);
      showError(
        "Error",
        "Failed to create session request. Please try again later."
      );
    }
  };

  // Handler for updating a session request
  const handleUpdateSessionRequest = async (
    sessionId: string,
    data: {
      startTime?: string;
      endTime?: string;
      location?: string;
      description?: string;
      status?: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
      mentorTeamId: string; // Required by the service
    }
  ) => {
    try {
      const response =
        await mentorshipSessionRequestService.updateMentorshipSessionRequest({
          id: sessionId,
          ...data,
        });

      if (response.data) {
        showSuccess("Success", "Session request updated successfully");
        onDataUpdate(); // Refresh data after successful update
      } else {
        showError(
          "Error",
          response.message || "Failed to update session request"
        );
      }
    } catch (error) {
      console.error("Failed to update session request:", error);
      showError(
        "Error",
        "Failed to update session request. Please try again later."
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold">
            Mentorship Overview
          </Dialog.Title>

          <Tab.Group>
            <Tab.List className="flex space-x-2 mt-4 border-b overflow-x-auto whitespace-nowrap scrollbar-hide">
              {[
                "Mentor Teams",
                "Mentorship Requests",
                "Session Requests",
                "Request a Mentor",
              ].map((label, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    `px-4 py-2 text-sm font-medium ${
                      selected
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-600"
                    }`
                  }
                >
                  {label}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-4">
              {/* Mentor Teams */}
              <Tab.Panel>
                <MentorTeamsTab
                  mentorTeams={mentorTeams}
                  mentorshipSessionRequests={mentorshipSessionRequests}
                  onCreateSessionRequest={handleCreateSessionRequest}
                />
              </Tab.Panel>

              {/* Mentorship Requests */}
              <Tab.Panel>
                <MentorshipRequestsTab
                  mentorshipRequests={mentorshipRequests}
                  onDeleteRequest={handleDeleteMentorshipRequest}
                />
              </Tab.Panel>

              {/* Mentorship Session Requests */}
              <Tab.Panel>
                <SessionRequestsTab
                  sessionRequests={mentorshipSessionRequests}
                  onUpdateRequest={handleUpdateSessionRequest}
                />
              </Tab.Panel>

              {/* Request a Mentor */}
              <Tab.Panel>
                <RequestMentorTab
                  mentors={mentors}
                  loading={loading}
                  onRequestMentorship={handleCreateMentorshipRequest}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          <div className="mt-6 text-right">
            <button
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
