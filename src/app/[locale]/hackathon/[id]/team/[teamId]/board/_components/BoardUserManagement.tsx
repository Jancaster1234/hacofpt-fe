// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/BoardUserManagement.tsx
"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Board } from "@/types/entities/board";
import { BoardUser, BoardUserRole } from "@/types/entities/boardUser";
import { Team } from "@/types/entities/team";
import { useAuth } from "@/hooks/useAuth_v0";
import { useKanbanStore } from "@/store/kanbanStore";

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
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<BoardUserRole>("MEMBER");
  const [error, setError] = useState<string | null>(null);

  // Use KanbanStore for state management
  const {
    createBoardUser,
    updateBoardUserRole,
    deleteBoardUser,
    isLoading,
    setError: setStoreError,
  } = useKanbanStore();

  // Get ALL boardUsers from the KanbanStore's board object (including deleted ones)
  const boardUsers = useKanbanStore((state) => state.board?.boardUsers || []);

  useEffect(() => {
    // Clear any errors when opening/closing modal
    setError(null);
    setStoreError(null);
  }, [isOpen, setStoreError]);

  // Filter team members who are not already active board users
  // This correctly filters out team members who are already active in the board
  const availableTeamMembers =
    team?.teamMembers?.filter(
      (tm) =>
        !boardUsers.some((bu) => !bu.isDeleted && bu.user?.id === tm.user.id)
    ) || [];

  const handleAddUser = async () => {
    if (!selectedTeamMember || !isOwner) return;

    setError(null);
    try {
      // Check if this user was previously deleted (soft-deleted)
      const existingBoardUser = boardUsers.find(
        (bu) => bu.user?.id === selectedTeamMember && bu.isDeleted
      );
      if (existingBoardUser) {
        // If the user was previously soft-deleted, update their role and isDeleted status
        await updateBoardUserRole(existingBoardUser.id, selectedRole);

        // The store already updates the state, so we don't need to do anything else
      } else {
        // Create a new board user if they didn't exist before
        await createBoardUser(selectedTeamMember, selectedRole);
      }

      // Reset the selection
      setSelectedTeamMember("");
    } catch (err) {
      setError("An error occurred while adding the user");
      console.error("Error adding user:", err);
    }
  };

  const handleUpdateRole = async (
    boardUser: BoardUser,
    newRole: BoardUserRole
  ) => {
    if (!isOwner) return;

    setError(null);
    try {
      await updateBoardUserRole(boardUser.id, newRole);
      // The store already updates the state
    } catch (err) {
      setError("An error occurred while updating the user role");
      console.error("Error updating user role:", err);
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

    setError(null);
    try {
      await deleteBoardUser(boardUser.id);
      // The store already updates the state
    } catch (err) {
      setError("An error occurred while removing the user");
      console.error("Error removing user:", err);
    }
  };

  // Filter out deleted users for display
  const activeBoardUsers = boardUsers.filter((bu) => !bu.isDeleted);

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

            {(error || useKanbanStore.getState().error) && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {error || useKanbanStore.getState().error}
              </div>
            )}

            <div className="mt-4 space-y-6">
              {/* Current board users */}
              <div>
                <h3 className="font-medium mb-2">Current Users</h3>
                {isLoading ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : activeBoardUsers.length === 0 ? (
                  <div className="text-gray-500 italic">No users found</div>
                ) : (
                  <div className="space-y-2">
                    {activeBoardUsers.map((boardUser) => (
                      <div
                        key={boardUser.id}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={
                                boardUser.user?.avatarUrl ||
                                "https://via.placeholder.com/40"
                              }
                              alt={`${boardUser.user?.firstName} ${boardUser.user?.lastName}`}
                              fill
                              sizes="32px"
                              className="object-cover"
                              priority
                            />
                          </div>
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
