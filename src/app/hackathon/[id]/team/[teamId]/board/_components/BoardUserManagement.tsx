// src/app/hackathon/[id]/team/[teamId]/board/_components/BoardUserManagement.tsx
"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Board } from "@/types/entities/board";
import { BoardUser, BoardUserRole } from "@/types/entities/boardUser";
import { Team } from "@/types/entities/team";
import { useAuth } from "@/hooks/useAuth_v0";
import { boardUserService } from "@/services/boardUser.service";

interface BoardUserManagementProps {
  board: Board;
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
}

export default function BoardUserManagement({
  board,
  team,
  isOpen,
  onClose,
  isOwner,
}: BoardUserManagementProps) {
  const { user } = useAuth();
  const [boardUsers, setBoardUsers] = useState<BoardUser[]>([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<BoardUserRole>("MEMBER");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch board users when the component mounts or board changes
  useEffect(() => {
    if (board?.id) {
      fetchBoardUsers();
    }
  }, [board?.id]);

  const fetchBoardUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await boardUserService.getBoardUsersByBoardId(board.id);
      if (response.data) {
        // Filter out deleted users
        setBoardUsers(response.data.filter((bu) => !bu.isDeleted));
      } else {
        setError("Failed to fetch board users");
      }
    } catch (err) {
      setError("An error occurred while fetching board users");
      console.error("Error fetching board users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter team members who are not already board users
  const availableTeamMembers =
    team?.teamMembers?.filter(
      (tm) => !boardUsers.some((bu) => bu.user?.id === tm.user.id)
    ) || [];

  const handleAddUser = async () => {
    if (!selectedTeamMember || !isOwner) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await boardUserService.createBoardUser({
        boardId: board.id,
        userId: selectedTeamMember,
        role: selectedRole,
        isDeleted: false,
      });

      if (response.data) {
        // Find the user details from team members
        const teamMember = team?.teamMembers?.find(
          (tm) => tm.user.id === selectedTeamMember
        );

        if (teamMember) {
          // Ensure the complete user object is attached
          const newBoardUser: BoardUser = {
            ...response.data,
            user: teamMember.user,
          };

          setBoardUsers([...boardUsers, newBoardUser]);
          setSelectedTeamMember("");
        }
      } else {
        setError(response.message || "Failed to add user to board");
      }
    } catch (err) {
      setError("An error occurred while adding the user");
      console.error("Error adding user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (
    boardUser: BoardUser,
    newRole: BoardUserRole
  ) => {
    if (!isOwner) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await boardUserService.updateBoardUser(boardUser.id, {
        boardId: boardUser.boardId,
        userId: boardUser.userId,
        role: newRole,
        isDeleted: false,
      });

      if (response.data) {
        // Update local state
        setBoardUsers(
          boardUsers.map((bu) =>
            bu.id === boardUser.id ? { ...bu, role: newRole } : bu
          )
        );
      } else {
        setError(response.message || "Failed to update user role");
      }
    } catch (err) {
      setError("An error occurred while updating the user role");
      console.error("Error updating user role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (boardUser: BoardUser) => {
    // Don't allow removing the owner/yourself or if not owner
    if (
      !isOwner ||
      boardUser.user?.id === board.owner?.id ||
      boardUser.user?.id === user?.id
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Instead of actually deleting, we'll update with isDeleted set to true
      const response = await boardUserService.deleteBoardUser(boardUser.id);

      if (response.data) {
        // Remove from local state
        setBoardUsers(boardUsers.filter((bu) => bu.id !== boardUser.id));
      } else {
        setError(response.message || "Failed to remove user");
      }
    } catch (err) {
      setError("An error occurred while removing the user");
      console.error("Error removing user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold">
              {isOwner ? "Manage Board Users" : "Board Users"}
            </Dialog.Title>

            {!isOwner && (
              <p className="mt-2 text-gray-500 italic">
                You are in view-only mode. Only the board owner can manage
                users.
              </p>
            )}

            {error && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mt-4 space-y-6">
              {/* Current board users */}
              <div>
                <h3 className="font-medium mb-2">Current Users</h3>
                {isLoading ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : boardUsers.length === 0 ? (
                  <div className="text-gray-500 italic">No users found</div>
                ) : (
                  <div className="space-y-2">
                    {boardUsers.map((boardUser) => (
                      <div
                        key={boardUser.id}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              boardUser.user?.avatarUrl ||
                              "https://via.placeholder.com/40"
                            }
                            alt={`${boardUser.user?.firstName} ${boardUser.user?.lastName}`}
                            className="w-8 h-8 rounded-full"
                          />
                          <span>
                            {boardUser.user?.firstName}{" "}
                            {boardUser.user?.lastName}
                            {boardUser.user?.id === board.owner?.id &&
                              " (Owner)"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {boardUser.user?.id !== board.owner?.id && isOwner ? (
                            <>
                              <select
                                value={boardUser.role}
                                onChange={(e) =>
                                  handleUpdateRole(
                                    boardUser,
                                    e.target.value as BoardUserRole
                                  )
                                }
                                disabled={isLoading}
                                className="border rounded px-2 py-1 text-sm"
                              >
                                <option value="ADMIN">Admin</option>
                                <option value="MEMBER">Member</option>
                              </select>
                              {boardUser.user?.id !== user?.id && (
                                <button
                                  onClick={() => handleRemoveUser(boardUser)}
                                  disabled={isLoading}
                                  className="px-2 py-1 text-red-600 hover:underline disabled:text-red-300"
                                >
                                  Remove
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {boardUser.role}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add new user - Only shown to owner */}
              {isOwner && availableTeamMembers.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Add Team Member</h3>
                  <div className="flex space-x-2">
                    <select
                      value={selectedTeamMember}
                      onChange={(e) => setSelectedTeamMember(e.target.value)}
                      disabled={isLoading}
                      className="flex-1 border rounded px-3 py-2"
                    >
                      <option value="">Select team member</option>
                      {availableTeamMembers.map((member) => (
                        <option key={member.user.id} value={member.user.id}>
                          {member.user.firstName} {member.user.lastName}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedRole}
                      onChange={(e) =>
                        setSelectedRole(e.target.value as BoardUserRole)
                      }
                      disabled={isLoading}
                      className="border rounded px-3 py-2"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                    </select>

                    <button
                      onClick={handleAddUser}
                      disabled={!selectedTeamMember || isLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                    >
                      {isLoading ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
                disabled={isLoading}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
