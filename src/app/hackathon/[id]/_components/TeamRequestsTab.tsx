// src/app/hackathon/[id]/_components/TeamRequestsTab.tsx
import { TeamRequest } from "@/types/entities/teamRequest";
import { useState, useEffect } from "react";
import { Trash2, X, Plus } from "lucide-react";
import { fetchMockUsers } from "../_mock/fetchMockUsers";
import { teamRequestService } from "@/services/teamRequest.service";
import { userService } from "@/services/user.service";

type TeamRequestsTabProps = {
  teamRequests: TeamRequest[];
  hackathonId: string;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
  user: any;
};

export default function TeamRequestsTab({
  teamRequests,
  hackathonId,
  minimumTeamMembers,
  maximumTeamMembers,
  user,
}: TeamRequestsTabProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<
    Array<{ userId: string; email: string }>
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search users when typing in the member field
  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsSearching(true);
      // Simulate API call to search users

      userService
        .getTeamMembers()
        .then((users) => {
          const filteredUsers = users.filter(
            (u) =>
              u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              `${u.firstName} ${u.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
          setSearchResults(filteredUsers);
        })
        .catch((error) => {
          console.error("Error fetching team members:", error);
          setSearchResults([]); // Clear results in case of error
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Delete team request
  const deleteTeamRequest = async (requestId: string, status: string) => {
    // Only allow deletion of pending or under_review statuses
    if (status !== "pending" && status !== "under_review") {
      alert(
        `You can only delete team requests with pending or under review status. Current status: ${status}`
      );
      return;
    }

    try {
      // Simulated API call
      console.log(`Deleting team request: ${requestId}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(`Team request ${requestId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting team request:", error);
      alert("Failed to delete team request");
    }
  };

  // Create team request
  const createTeamRequest = async () => {
    // Check if user already has a non-rejected team request
    const activeRequest = teamRequests.find(
      (req) =>
        req.status === "pending" ||
        req.status === "under_review" ||
        req.status === "approved"
    );

    if (activeRequest) {
      alert(
        `You already have a team request for this hackathon with status: ${activeRequest.status}.`
      );
      return;
    }

    // Validate form
    if (!teamName.trim()) {
      alert("Please enter a team name");
      return;
    }

    if (selectedMembers.length < minimumTeamMembers - 1) {
      alert(
        `You need at least ${minimumTeamMembers} team members (including yourself)`
      );
      return;
    }

    try {
      // Calculate confirmation deadline (current date + 1 day)
      const confirmationDeadline = new Date();
      confirmationDeadline.setDate(confirmationDeadline.getDate() + 1);

      // Prepare request body
      const requestBody = {
        hackathonId,
        name: teamName,
        status: "pending",
        confirmationDeadline: confirmationDeadline.toISOString(),
        teamRequestMembers: [
          // Add current user as team leader
          { userId: user?.id, status: "approved" },
          // Add selected members
          ...selectedMembers.map((member) => ({
            userId: member.userId,
            status: "pending",
          })),
        ],
      };

      console.log("Creating team request with data:", requestBody);

      // Simulate successful creation
      const newTeamRequest =
        await teamRequestService.createTeamRequest(requestBody);

      alert("Team request created successfully!");
      // Reset form
      setTeamName("");
      setSelectedMembers([]);
      setIsCreating(false);

      // In a real implementation, you would refresh the data here
    } catch (error) {
      console.error("Error creating team request:", error);
      alert("Failed to create team request");
    }
  };

  // Add member to selection
  const addMember = (user: any) => {
    // Check if user is already selected
    if (selectedMembers.some((m) => m.userId === user.id)) {
      return;
    }

    // Check if max team size is reached
    if (selectedMembers.length >= maximumTeamMembers - 1) {
      alert(`Maximum team size is ${maximumTeamMembers}`);
      return;
    }

    setSelectedMembers([
      ...selectedMembers,
      { userId: user.id, email: user.email },
    ]);
    setSearchTerm("");
    setSearchResults([]);
  };

  // Remove member from selection
  const removeMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.userId !== userId));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Your Team Requests</h4>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            <Plus size={16} /> Create Team Request
          </button>
        )}
      </div>

      {teamRequests.length === 0 && !isCreating ? (
        <p className="text-gray-500 italic mb-4">
          No team requests found. Click the button above to create a new team
          request.
        </p>
      ) : teamRequests.length > 0 ? (
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
                            request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : request.status === "under_review"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          Status: {request.status}
                        </span>
                      </p>
                    </div>
                    {/* Only show delete for pending or under_review status */}
                    {(request.status === "pending" ||
                      request.status === "under_review") && (
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
                              member.status === "approved"
                                ? "bg-green-500"
                                : member.status === "rejected"
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
      ) : (
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
              Team Members (Min: {minimumTeamMembers}, Max: {maximumTeamMembers}
              )
            </label>
            <p className="text-xs text-gray-500 mb-2">
              You will be automatically added as a team member
            </p>

            {/* Selected members list */}
            <div className="mb-2">
              {selectedMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center bg-blue-50 p-2 rounded mb-1"
                >
                  <span className="flex-1">{member.email}</span>
                  <button
                    onClick={() => removeMember(member.userId)}
                    className="text-red-500"
                  >
                    <X size={16} />
                  </button>
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
              onClick={() => setIsCreating(false)}
              className="bg-gray-300 hover:bg-gray-400 font-bold py-2 px-6 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
