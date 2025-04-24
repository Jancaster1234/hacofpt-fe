// src/app/[locale]/hackathon/[id]/_components/TeamRequestsTab.tsx
import { TeamRequest } from "@/types/entities/teamRequest";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { useState, useEffect } from "react";
import { Trash2, X, Plus, User, AlertCircle } from "lucide-react";
import { useApiModal } from "@/hooks/useApiModal";
import { teamRequestService } from "@/services/teamRequest.service";
import { userService } from "@/services/user.service";
import { useAuth } from "@/hooks/useAuth_v0";

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
        showInfo(
          "Request Already Exists",
          `You already have a team request for this hackathon with status: ${activeRequest?.status}.`
        );
      } else if (hasActiveIndividualRegistration()) {
        const activeReg = getActiveIndividualRegistration();
        showInfo(
          "Individual Registration Exists",
          `You already have an individual registration for this hackathon with status: ${activeReg?.status}. Please cancel it first to create a team request.`
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
      return `You already have a team request with status: ${activeRequest?.status}`;
    } else if (hasActiveIndividualRegistration()) {
      const activeReg = getActiveIndividualRegistration();
      return `You have an individual registration with status: ${activeReg?.status}. Please cancel it first.`;
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
    const fetchTeamMembers = async () => {
      try {
        const { data: members } = await userService.getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error("Error fetching team members:", error);
        showError("Error", "Failed to fetch team members");
      }
    };

    fetchTeamMembers();
  }, [showError]);

  // Search users when typing in the member field
  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsSearching(true);

      // Filter team members based on search term and exclude current user
      const filterTeamMembers = () => {
        try {
          const filteredUsers = teamMembers.filter((member) => {
            // Skip current user in search results
            if (currentUser && member.id === currentUser.id) {
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
          showError("Search Error", "Failed to search for users");
          console.error("Error searching for users:", error);
        } finally {
          setIsSearching(false);
        }
      };

      filterTeamMembers();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, teamMembers, showError, currentUser]);

  // Delete team request
  const deleteTeamRequest = async (requestId: string, status: string) => {
    // Only allow deletion of pending or under_review statuses
    if (
      status.toLowerCase() !== "pending" &&
      status.toLowerCase() !== "under_review"
    ) {
      showInfo(
        "Cannot Delete Request",
        `You can only delete team requests with pending or under review status. Current status: ${status}`
      );
      return;
    }

    try {
      await teamRequestService.deleteTeamRequest(requestId);
      showSuccess("Request Deleted", "Team request deleted successfully");

      // Refresh the data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error deleting team request:", error);
      showError("Delete Failed", "Failed to delete team request");
    }
  };

  // Create team request
  const createTeamRequest = async () => {
    // Double-check if user can create a new team request
    if (hasActiveTeamRequest() || hasActiveIndividualRegistration()) {
      // Show appropriate message
      if (hasActiveTeamRequest()) {
        const activeRequest = getActiveTeamRequest();
        showInfo(
          "Request Already Exists",
          `You already have a team request for this hackathon with status: ${activeRequest?.status}.`
        );
      } else if (hasActiveIndividualRegistration()) {
        const activeReg = getActiveIndividualRegistration();
        showInfo(
          "Individual Registration Exists",
          `You already have an individual registration for this hackathon with status: ${activeReg?.status}. Please cancel it first to create a team request.`
        );
      }

      setIsCreating(false);
      return;
    }

    // Validate form
    if (!teamName.trim()) {
      showInfo("Invalid Input", "Please enter a team name");
      return;
    }

    // The current user is already included, so we check if we have enough members in total
    if (selectedMembers.length < minimumTeamMembers) {
      showInfo(
        "Not Enough Members",
        `You need at least ${minimumTeamMembers} team members (including yourself)`
      );
      return;
    }

    try {
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

      // Call the real service
      const response = await teamRequestService.createTeamRequest(requestBody);

      showSuccess("Team Request Created", "Team request created successfully!");

      // Reset form
      setTeamName("");
      setTeamNote("");
      setSelectedMembers([]);
      setIsCreating(false);

      // Refresh the data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error creating team request:", error);
      showError("Creation Failed", "Failed to create team request");
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
      showInfo(
        "Maximum Size Reached",
        `Maximum team size is ${maximumTeamMembers}`
      );
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Your Team Requests</h4>
        {!isCreating && (
          <div className="relative">
            {/* Tooltip that appears when hovering over a disabled button */}
            {!canCreateTeamRequest && showTooltip && (
              <div className="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow-lg">
                {disabledReason}
              </div>
            )}
            <button
              onClick={
                canCreateTeamRequest ? handleCreateTeamRequest : undefined
              }
              className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
                canCreateTeamRequest
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!canCreateTeamRequest}
              aria-label={
                canCreateTeamRequest ? "Create Team Request" : disabledReason
              }
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Plus size={16} /> Create Team Request
              {!canCreateTeamRequest && (
                <AlertCircle size={16} className="ml-1 text-gray-500" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Display a message explaining why the user can't create a team request */}
      {!isCreating && !canCreateTeamRequest && (
        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4 flex items-start">
          <AlertCircle
            className="text-gray-500 mr-2 mt-0.5 flex-shrink-0"
            size={18}
          />
          <p className="text-sm text-gray-600">{disabledReason}</p>
        </div>
      )}

      {/* Show creation form when isCreating is true */}
      {isCreating ? (
        <div className="border p-4 rounded-lg">
          <h5 className="font-medium mb-2">Create Team Request</h5>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter team name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Note (Optional)
            </label>
            <textarea
              value={teamNote}
              onChange={(e) => setTeamNote(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Optional team note or description"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Members (Min: {minimumTeamMembers}, Max: {maximumTeamMembers}
              )
            </label>

            {/* Selected members list */}
            <div className="mb-2">
              {selectedMembers.map((member) => (
                <div
                  key={member.userId}
                  className={`flex items-center ${member.isCurrentUser ? "bg-green-50" : "bg-blue-50"} p-2 rounded mb-1`}
                >
                  <span className="flex-1">
                    {member.isCurrentUser && (
                      <span className="text-green-600 mr-1">(You)</span>
                    )}
                    {member.email}
                  </span>
                  {!member.isCurrentUser && (
                    <button
                      onClick={() => removeMember(member.userId)}
                      className="text-red-500"
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
                className="border p-2 rounded w-full"
                placeholder="Search by email or name"
              />

              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => addMember(user)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div>{user.email}</div>
                      <div className="text-sm text-gray-500">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isSearching && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg p-2 text-center">
                  Searching...
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={createTeamRequest}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition flex-1"
            >
              Create Team Request
            </button>
            <button
              onClick={handleCancelCreation}
              className="bg-gray-300 hover:bg-gray-400 font-bold py-2 px-6 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : teamRequests.length === 0 ? (
        <p className="text-gray-500 italic mb-4">
          No team requests found.{" "}
          {canCreateTeamRequest
            ? "Click the button above to create a new team request."
            : ""}
        </p>
      ) : (
        <ul className="space-y-3">
          {teamRequests.map((request) => (
            <li
              key={request.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h5 className="font-semibold">
                        Team name: {request.name}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status.toLowerCase() === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status.toLowerCase() === "rejected"
                                ? "bg-red-100 text-red-800"
                                : request.status.toLowerCase() ===
                                    "under_review"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          Status: {request.status}
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
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete request"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Deadline:</span>{" "}
                    {new Date(
                      request.confirmationDeadline
                    ).toLocaleDateString()}
                  </p>
                  {request.note && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Note:</span> {request.note}
                    </p>
                  )}
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600">
                      Team Members:
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
                          ></span>
                          {member.user.firstName} {member.user.lastName}
                          <span className="ml-2 text-xs text-gray-500">
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
