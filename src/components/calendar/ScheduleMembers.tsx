// src/components/calendar/ScheduleMembers.tsx
import React from "react";
import { User } from "@/types/entities/user";
import Image from "next/image";

interface ScheduleMembersProps {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  scheduleName: string;
}

const ScheduleMembers: React.FC<ScheduleMembersProps> = ({
  isOpen,
  onClose,
  members,
  scheduleName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {scheduleName} - Team Members
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {members.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No members found</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {members.map((member) => (
                <li key={member.id} className="py-3">
                  <div className="flex items-center space-x-3">
                    {member.avatarUrl ? (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={member.avatarUrl}
                          alt={`${member.firstName}'s avatar`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                        {member.firstName?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      {member.userRoles && member.userRoles.length > 0 && (
                        <p className="text-xs text-gray-400">
                          {member.userRoles[0].role.name.replace("_", " ")}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMembers;
