// src/app/[locale]/hackathon/[id]/_components/TeamRequestsTab.tsx
import { TeamRequest } from "@/types/entities/teamRequest";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { useState, useEffect } from "react";
import { Trash2, X, Plus, User, AlertCircle, Loader } from "lucide-react";
import { useApiModal } from "@/hooks/useApiModal";
import { teamRequestService } from "@/services/teamRequest.service";
import { userService } from "@/services/user.service";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";
import { useTheme } from "next-themes";

type TeamRequestsTabProps = {
  teamRequests: TeamRequest[];
  individualRegistrations: IndividualRegistrationRequest[];
  hackathonId: string;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
  user: any;
  onDataUpdate?: () => void;
};

export type User = {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  country?: string;
  city?: string;
  birthdate?: string;
};

export default function TeamRequestsTab({
  teamRequests,
  individualRegistrations,
  hackathonId,
  minimumTeamMembers,
  maximumTeamMembers,
  user,
  onDataUpdate,
}: TeamRequestsTabProps) {
  // Translation hooks
  const t = useTranslations("teamRequests");

  // Theme
  const { theme, setTheme } = useTheme();

  // Toast notifications
  const toast = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamNote, setTeamNote] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<
    Array<{ userId: string; email: string; isCurrentUser?: boolean }>
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const { user: currentUser } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  // Loading states
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [isDeletingRequest, setIsDeletingRequest] = useState<string | null>(
    null
  );

  // Use our API modal hook for error and success handling
  const { showError, showSuccess, showInfo } = useApiModal();

  // Add current user when creating a new team request
  const handleCreateTeamRequest = () => {
    // Check if user can create a new team request
    const canCreateNewRequest =
      !hasActiveTeamRequest() && !hasActiveIndividualRegistration();

    if (!canCreateNewRequest) {
      // Show appropriate message based on what's preventing creation
      if (hasActiveTeamRequest()) {
        const activeRequest = getActiveTeamRequest();
        toast.info(
          t("requestAlreadyExists", { status: activeRequest?.status })
        );
      } else if (hasActiveIndividualRegistration()) {
        const activeReg = getActiveIndividualRegistration();
        toast.info(
          t("individualRegistrationExists", { status: activeReg?.status })
        );
      }
      return;
    }

    setIsCreating(true);
    // Add current user to the selected members
    if (currentUser && currentUser.id && currentUser.email) {
      setSelectedMembers([
        {
          userId: currentUser.id,
          email: currentUser.email,
          isCurrentUser: true, // Flag to identify this is the current user
        },
      ]);
    }
  };

  // Helper functions to check active requests/registrations
  const hasActiveTeamRequest = () => {
    return teamRequests.some(
      (req) =>
        req.status.toLowerCase() === "pending" ||
        req.status.toLowerCase() === "under_review" ||
        req.status.toLowerCase() === "approved"
    );
  };

  const getActiveTeamRequest = () => {
    return teamRequests.find(
      (req) =>
        req.status.toLowerCase() === "pending" ||
        req.status.toLowerCase() === "under_review" ||
        req.status.toLowerCase() === "approved"
    );
  };

  const hasActiveIndividualRegistration = () => {
    return individualRegistrations.some(
      (reg) => reg.status === "PENDING" || reg.status === "APPROVED"
    );
  };

  const getActiveIndividualRegistration = () => {
    return individualRegistrations.find(
      (reg) => reg.status === "PENDING" || reg.status === "APPROVED"
    );
  };

  // Get the reason why the user can't create a team request
  const getDisabledReason = () => {
    if (hasActiveTeamRequest()) {
      const activeRequest = getActiveTeamRequest();
      return t("existingTeamRequestReason", { status: activeRequest?.status });
    } else if (hasActiveIndividualRegistration()) {
      const activeReg = getActiveIndividualRegistration();
      return t("existingIndividualRegistrationReason", {
        status: activeReg?.status,
      });
    }
    return "";
  };

  // Check if user can create a new team request
  const canCreateTeamRequest =
    !hasActiveTeamRequest() && !hasActiveIndividualRegistration();
  // Get the reason why the button is disabled
  const disabledReason = getDisabledReason();

  // Fetch all team members when component mounts
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchTeamMembers = async () => {
      try {
        setIsLoadingMembers(true);
        const response = await userService.getTeamMembers({
          signal: controller.signal, // Add abort signal to request
        });

        if (isMounted) {
          setTeamMembers(response.data);
          // Removed success toast from normal data fetching
        }
      } catch (error) {
        // Only log error but don't show toast for background data fetching
        if (error.name !== "AbortError" && isMounted) {
          console.error("Error fetching team members:", error);
          // Removed toast for background data fetching errors
        }
      } finally {
        if (isMounted) {
          setIsLoadingMembers(false);
        }
      }
    };

    fetchTeamMembers();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };

    // Add empty dependency array to only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search users when typing in the member field
  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsSearching(true);

      // Use a timeout to debounce the search
      const timeoutId = setTimeout(() => {
        try {
          // Filter team members based on search term and exclude current user
          const filteredUsers = teamMembers.filter((member) => {
            // Skip current user in search results
            if (currentUser && member.id === currentUser.id) {
              return false;
            }

            // Skip already selected members
            if (
              selectedMembers.some((selected) => selected.userId === member.id)
            ) {
              return false;
            }

            return (
              member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              `${member.firstName} ${member.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            );
          });

          setSearchResults(filteredUsers);
        } catch (error) {
          toast.error(t("searchError"));
          console.error("Error searching for users:", error);
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, teamMembers, currentUser, selectedMembers]);

  // Delete team request
  const deleteTeamRequest = async (requestId: string, status: string) => {
    // Only allow deletion of pending or under_review statuses
    if (
      status.toLowerCase() !== "pending" &&
      status.toLowerCase() !== "under_review"
    ) {
      toast.info(t("cannotDeleteRequest", { status }));
      return;
    }

    try {
      setIsDeletingRequest(requestId);
      const response = await teamRequestService.deleteTeamRequest(requestId);

      toast.success(t("requestDeleted"));

      // Refresh the data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error: any) {
      console.error("Error deleting team request:", error);
      toast.error(error.message || t("deleteFailed"));
    } finally {
      setIsDeletingRequest(null);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!teamName.trim()) {
      toast.error(t("missingTeamName"));
      return false;
    }

    if (selectedMembers.length < minimumTeamMembers) {
      toast.error(t("notEnoughMembers", { minimumTeamMembers }));
      return false;
    }

    if (selectedMembers.length > maximumTeamMembers) {
      toast.error(t("tooManyMembers", { maximumTeamMembers }));
      return false;
    }

    return true;
  };

  // Create team request
  const createTeamRequest = async () => {
    // Double-check if user can create a new team request
    if (hasActiveTeamRequest() || hasActiveIndividualRegistration()) {
      // Show appropriate message
      if (hasActiveTeamRequest()) {
        const activeRequest = getActiveTeamRequest();
        toast.info(
          t("requestAlreadyExists", { status: activeRequest?.status })
        );
      } else if (hasActiveIndividualRegistration()) {
        const activeReg = getActiveIndividualRegistration();
        toast.info(
          t("individualRegistrationExists", { status: activeReg?.status })
        );
      }

      setIsCreating(false);
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setIsCreatingRequest(true);
      // Prepare request body
      const requestBody = {
        hackathonId,
        name: teamName,
        note: teamNote,
        teamRequestMembers: [
          // Add selected members
          ...selectedMembers.map((member) => ({
            userId: member.userId,
          })),
        ],
      };

      // Call the service
      const response = await teamRequestService.createTeamRequest(requestBody);

      toast.success(t("teamRequestCreated"));

      // Reset form
      setTeamName("");
      setTeamNote("");
      setSelectedMembers([]);
      setIsCreating(false);

      // Refresh the data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error: any) {
      console.error("Error creating team request:", error);
      toast.error(error.message || t("creationFailed"));
    } finally {
      setIsCreatingRequest(false);
    }
  };

  // Add member to selection
  const addMember = (user: any) => {
    // Check if user is already selected
    if (selectedMembers.some((m) => m.userId === user.id)) {
      return;
    }

    // Check if max team size is reached
    if (selectedMembers.length >= maximumTeamMembers) {
      toast.info(t("maximumSizeReached", { maximumTeamMembers }));
      return;
    }

    setSelectedMembers([
      ...selectedMembers,
      { userId: user.id, email: user.email },
    ]);
    setSearchTerm("");
    setSearchResults([]);
  };

  // Remove member from selection (except current user)
  const removeMember = (userId: string) => {
    const member = selectedMembers.find((m) => m.userId === userId);

    // Don't allow removing the current user
    if (member?.isCurrentUser) {
      return;
    }

    setSelectedMembers(selectedMembers.filter((m) => m.userId !== userId));
  };

  // Function to handle canceling creation and resetting form
  const handleCancelCreation = () => {
    setIsCreating(false);
    setTeamName("");
    setTeamNote("");
    setSelectedMembers([]);
  };

  // Helper to get status style classes
  const getStatusClasses = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200";

    switch (status.toLowerCase()) {
      case "approved":
        return `${baseClasses} bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300`;
      case "rejected":
        return `${baseClasses} bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-300`;
      case "under_review":
        return `${baseClasses} bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300`;
      default:
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-300`;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      t("locale") === "vi" ? "vi-VN" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );
  };

  return (
    <div className="transition-colors duration-300 dark:text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h4 className="font-medium text-lg dark:text-white">
          {t("yourTeamRequests")}
        </h4>
        {!isCreating && (
          <div className="relative w-full sm:w-auto">
            {/* Tooltip that appears when hovering over a disabled button */}
            {!canCreateTeamRequest && showTooltip && (
              <div className="absolute bottom-full mb-2 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow-lg">
                {disabledReason}
              </div>
            )}
            <button
              onClick={
                canCreateTeamRequest ? handleCreateTeamRequest : undefined
              }
              className={`flex items-center justify-center w-full sm:w-auto gap-1 px-3 py-2 rounded transition-colors duration-200 ${
                canCreateTeamRequest
                  ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
              disabled={!canCreateTeamRequest}
              aria-label={
                canCreateTeamRequest ? t("createTeamRequest") : disabledReason
              }
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Plus size={16} /> {t("createTeamRequest")}
              {!canCreateTeamRequest && (
                <AlertCircle
                  size={16}
                  className="ml-1 text-gray-500 dark:text-gray-400"
                />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Display a message explaining why the user can't create a team request */}
      {!isCreating && !canCreateTeamRequest && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 mb-4 flex items-start">
          <AlertCircle
            className="text-gray-500 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0"
            size={18}
          />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {disabledReason}
          </p>
        </div>
      )}

      {/* Show creation form when isCreating is true */}
      {isCreating ? (
        <div className="border dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-all duration-300">
          <h5 className="font-medium mb-4 text-gray-900 dark:text-gray-100">
            {t("createTeamRequest")}
          </h5>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="team-name"
            >
              {t("teamName")} <span className="text-red-500">*</span>
            </label>
            <input
              id="team-name"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder={t("enterTeamName")}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="team-note"
            >
              {t("teamNote")}
            </label>
            <textarea
              id="team-note"
              value={teamNote}
              onChange={(e) => setTeamNote(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder={t("optionalTeamNote")}
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("teamMembers", {
                min: minimumTeamMembers,
                max: maximumTeamMembers,
              })}{" "}
              <span className="text-red-500">*</span>
            </label>

            {/* Selected members list */}
            <div className="mb-2">
              {selectedMembers.map((member) => (
                <div
                  key={member.userId}
                  className={`flex items-center ${
                    member.isCurrentUser
                      ? "bg-green-50 dark:bg-green-900/20"
                      : "bg-blue-50 dark:bg-blue-900/20"
                  } p-2 rounded mb-1 transition-colors duration-200`}
                >
                  <span className="flex-1 break-all">
                    {member.isCurrentUser && (
                      <span className="text-green-600 dark:text-green-400 mr-1">
                        ({t("youLabel")})
                      </span>
                    )}
                    {member.email}
                  </span>
                  {!member.isCurrentUser && (
                    <button
                      onClick={() => removeMember(member.userId)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 transition-colors duration-200"
                      aria-label={t("removeMember")}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Member search input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder={t("searchByEmailOrName")}
              />

              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto transition-colors duration-200">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => addMember(user)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    >
                      <div className="dark:text-white">{user.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isSearching && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg p-2 text-center transition-colors duration-200">
                  <div className="flex items-center justify-center gap-2">
                    <Loader
                      size={16}
                      className="animate-spin text-blue-500 dark:text-blue-400"
                    />
                    <span className="dark:text-gray-300">{t("searching")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={createTeamRequest}
              disabled={isCreatingRequest}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors duration-200 flex items-center justify-center sm:flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCreatingRequest ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" /> {t("creating")}
                </>
              ) : (
                t("createTeamRequest")
              )}
            </button>
            <button
              onClick={handleCancelCreation}
              disabled={isCreatingRequest}
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-2 px-6 rounded transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : isLoadingMembers ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" showText={true} />
        </div>
      ) : teamRequests.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 italic mb-4 p-6 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <p>
            {t("noTeamRequests")}{" "}
            {canCreateTeamRequest ? t("clickToCreate") : ""}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {teamRequests.map((request) => (
            <li
              key={request.id}
              className="border dark:border-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        {t("teamNameLabel")} {request.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        <span className={getStatusClasses(request.status)}>
                          {t("statusLabel")} {request.status}
                        </span>
                      </p>
                    </div>
                    {/* Only show delete for pending or under_review status */}
                    {(request.status.toLowerCase() === "pending" ||
                      request.status.toLowerCase() === "under_review") && (
                      <button
                        onClick={() =>
                          deleteTeamRequest(request.id, request.status)
                        }
                        disabled={isDeletingRequest === request.id}
                        className={`text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 ${
                          isDeletingRequest === request.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={t("deleteRequest")}
                        aria-label={t("deleteRequest")}
                      >
                        {isDeletingRequest === request.id ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    <span className="font-medium">{t("deadlineLabel")}</span>{" "}
                    {formatDate(request.confirmationDeadline)}
                  </p>
                  {request.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <span className="font-medium">{t("noteLabel")}</span>{" "}
                      {request.note}
                    </p>
                  )}
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {t("teamMembersLabel")}
                    </p>
                    <ul className="mt-1 space-y-1">
                      {request.teamRequestMembers.map((member) => (
                        <li
                          key={member.id}
                          className="text-sm flex items-center"
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              member.status.toLowerCase() === "approved"
                                ? "bg-green-500"
                                : member.status.toLowerCase() === "rejected"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                            }`}
                            aria-hidden="true"
                          ></span>
                          <span className="dark:text-gray-300">
                            {member.user.firstName} {member.user.lastName}
                          </span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            ({member.status})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
