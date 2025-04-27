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
import { useTranslations } from "@/hooks/useTranslations";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Import real services
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
  teamId: string;
  onDataUpdate: () => void;
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
  const { theme } = useTheme();
  const t = useTranslations("mentorship");
  const toast = useToast();

  // Use our API modal hook for error and success handling
  const { modalState, hideModal, showError, showSuccess, showInfo } =
    useApiModal();

  // Fix for the useEffect to prevent infinite loop
  useEffect(() => {
    let isMounted = true; // Add a mounted check

    if (isOpen) {
      setLoading(true);
      // Don't show toast here as it can cause re-renders

      userHackathonService
        .getUserHackathonsByRole(hackathonId, "MENTOR")
        .then((response) => {
          if (!isMounted) return; // Prevent state updates if unmounted

          if (response.data) {
            const mentorUsers = response.data.map(
              (userHackathon) => userHackathon.user
            ) as User[];
            setMentors(mentorUsers);
            // Only show toast if there was an actual success message
            if (response.message) {
              toast.success(response.message);
            }
          } else if (response.message) {
            toast.error(response.message);
          }
        })
        .catch((error) => {
          if (!isMounted) return;
          console.error("Failed to fetch mentors:", error);
          toast.error(t("mentorLoadError"));
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [hackathonId, isOpen]); // Remove toast and t from dependency array

  // Handler for creating a new mentorship request
  const handleCreateMentorshipRequest = async (mentorId: string) => {
    try {
      setLoading(true);
      toast.info(t("creatingRequest"));

      const response = await mentorshipRequestService.createMentorshipRequest({
        hackathonId,
        mentorId,
        teamId,
        status: "PENDING",
      });

      if (response.data && response.data.id) {
        toast.success(response.message || t("requestCreatedSuccess"));
        onDataUpdate();
      } else {
        toast.error(response.message || t("requestCreationError"));
      }
    } catch (error) {
      console.error("Failed to create mentorship request:", error);
      toast.error(t("requestCreationError"));
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting a mentorship request
  const handleDeleteMentorshipRequest = async (requestId: string) => {
    try {
      setLoading(true);
      toast.info(t("deletingRequest"));

      const response =
        await mentorshipRequestService.deleteMentorshipRequest(requestId);

      if (response.message) {
        toast.success(response.message || t("requestDeletedSuccess"));
        onDataUpdate();
      } else {
        toast.error(t("requestDeletionError"));
      }
    } catch (error) {
      console.error("Failed to delete mentorship request:", error);
      toast.error(t("requestDeletionError"));
    } finally {
      setLoading(false);
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
      setLoading(true);
      toast.info(t("creatingSessionRequest"));

      const response =
        await mentorshipSessionRequestService.createMentorshipSessionRequest({
          ...data,
          status: "PENDING",
        });

      if (response.data && response.data.id) {
        toast.success(response.message || t("sessionRequestCreatedSuccess"));
        onDataUpdate();
      } else {
        toast.error(response.message || t("sessionRequestCreationError"));
      }
    } catch (error) {
      console.error("Failed to create session request:", error);
      toast.error(t("sessionRequestCreationError"));
    } finally {
      setLoading(false);
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
      mentorTeamId: string;
    }
  ) => {
    try {
      setLoading(true);
      toast.info(t("updatingSessionRequest"));

      const response =
        await mentorshipSessionRequestService.updateMentorshipSessionRequest({
          id: sessionId,
          ...data,
        });

      if (response.data) {
        toast.success(response.message || t("sessionRequestUpdatedSuccess"));
        onDataUpdate();
      } else {
        toast.error(response.message || t("sessionRequestUpdateError"));
      }
    } catch (error) {
      console.error("Failed to update session request:", error);
      toast.error(t("sessionRequestUpdateError"));
    } finally {
      setLoading(false);
    }
  };

  const tabLabels = [
    t("tabMentorTeams"),
    t("tabMentorshipRequests"),
    t("tabSessionRequests"),
    t("tabRequestMentor"),
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 transition-opacity duration-300"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 sm:p-6 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto transition-colors duration-300">
          <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
            {t("mentorshipOverview")}
          </Dialog.Title>

          {loading && (
            <div className="flex justify-center my-4">
              <LoadingSpinner size="md" showText={true} />
            </div>
          )}

          <Tab.Group>
            <Tab.List className="flex space-x-1 sm:space-x-2 mt-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {tabLabels.map((label, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    `px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-t transition-colors duration-200 ${
                      selected
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
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
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={onClose}
              disabled={loading}
              aria-label={t("close")}
            >
              {t("close")}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
