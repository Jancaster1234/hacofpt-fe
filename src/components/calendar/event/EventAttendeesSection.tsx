// src/components/calendar/event/EventAttendeesSection.tsx
import React, { useState, useEffect } from "react";
import { User } from "@/types/entities/user";
import {
  ScheduleEventAttendee,
  ScheduleEventStatus,
} from "@/types/entities/scheduleEventAttendee";
import { scheduleEventAttendeeService } from "@/services/scheduleEventAttendee.service";
import { userService } from "@/services/user.service";

interface EventAttendeesSectionProps {
  attendees: ScheduleEventAttendee[];
  setAttendees: (attendees: ScheduleEventAttendee[]) => void;
  teamMembers: User[];
  scheduleEventId?: string;
}

interface AttendeeWithUser extends ScheduleEventAttendee {
  user?: User;
}

const EventAttendeesSection: React.FC<EventAttendeesSectionProps> = ({
  attendees,
  setAttendees,
  teamMembers,
  scheduleEventId,
}) => {
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attendeesWithUsers, setAttendeesWithUsers] = useState<
    AttendeeWithUser[]
  >([]);

  // Load attendees when component mounts or schedule event ID changes
  useEffect(() => {
    if (scheduleEventId) {
      loadAttendees();
    }
  }, [scheduleEventId]);

  // Fetch user information for each attendee when attendees array changes
  useEffect(() => {
    fetchUsersForAttendees();
  }, [attendees]);

  const loadAttendees = async () => {
    if (!scheduleEventId) return;

    setIsLoading(true);
    try {
      const { data } =
        await scheduleEventAttendeeService.getAttendeesByScheduleEventId(
          scheduleEventId
        );
      setAttendees(data);
    } catch (error) {
      console.error("Failed to load attendees", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersForAttendees = async () => {
    if (!attendees.length) {
      setAttendeesWithUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const updatedAttendees = await Promise.all(
        attendees.map(async (attendee) => {
          if (!attendee.userId) {
            return { ...attendee, user: undefined };
          }

          try {
            const { data: user } = await userService.getUserById(
              attendee.userId
            );
            return { ...attendee, user };
          } catch (error) {
            console.error(
              `Failed to fetch user for attendee ${attendee.id}`,
              error
            );
            return { ...attendee, user: undefined };
          }
        })
      );

      setAttendeesWithUsers(updatedAttendees);
    } catch (error) {
      console.error("Failed to fetch users for attendees", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttendee = async (user: User) => {
    if (!scheduleEventId) return;

    // Check if user is already an attendee
    if (attendees.some((a) => a.userId === user.id)) {
      return;
    }

    setIsLoading(true);
    try {
      // Make API call to add attendee
      const { data: newAttendee } =
        await scheduleEventAttendeeService.addAttendeeToScheduleEvent({
          scheduleEventId,
          userId: user.id,
          status: "INVITED",
        });

      // Update local state with the new attendee from API
      setAttendees([...attendees, newAttendee]);
    } catch (error) {
      console.error("Failed to add attendee", error);
    } finally {
      setIsLoading(false);
      setShowMemberSelector(false);
    }
  };

  const handleRemoveAttendee = async (attendeeId: string) => {
    setIsLoading(true);
    try {
      // Make API call to remove attendee
      await scheduleEventAttendeeService.removeAttendeeFromScheduleEvent(
        attendeeId
      );

      // Update local state
      setAttendees(attendees.filter((a) => a.id !== attendeeId));
    } catch (error) {
      console.error("Failed to remove attendee", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeStatus = async (
    attendeeId: string,
    status: ScheduleEventStatus
  ) => {
    if (!scheduleEventId) return;

    setIsLoading(true);
    try {
      // Get the attendee object
      const attendee = attendees.find((a) => a.id === attendeeId);

      if (!attendee) {
        console.error("Attendee not found");
        return;
      }

      // Make API call to update attendee's status
      const { data: updatedAttendee } =
        await scheduleEventAttendeeService.updateScheduleEventAttendeeStatus(
          attendeeId,
          {
            scheduleEventId: scheduleEventId,
            userId: attendee.userId,
            status: status,
          }
        );

      // Update local state with the updated attendee data from API
      setAttendees(
        attendees.map((a) => (a.id === attendeeId ? updatedAttendee : a))
      );
    } catch (error) {
      console.error("Failed to update attendee status", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out team members who are already attendees
  const availableTeamMembers = teamMembers.filter(
    (member) => !attendees.some((a) => a.userId === member.id)
  );

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-400">
          Attendees
        </h6>
        <button
          type="button"
          onClick={() => setShowMemberSelector(!showMemberSelector)}
          className="px-3 py-1.5 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          disabled={isLoading}
        >
          Add Attendee
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-3">
          <p className="text-sm text-gray-500">Loading attendees...</p>
        </div>
      )}

      {showMemberSelector && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <h6 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
            Select Team Member
          </h6>
          {availableTeamMembers.length === 0 ? (
            <p className="text-sm text-gray-500">
              All team members are already added as attendees.
            </p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-2">
              {availableTeamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleAddAttendee(member)}
                  className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                    {member.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {attendeesWithUsers.length > 0 ? (
        <div className="space-y-2">
          {attendeesWithUsers.map((attendee) => (
            <div
              key={attendee.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800"
            >
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                  {attendee.user?.firstName?.charAt(0) || "U"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {attendee.user?.firstName} {attendee.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {attendee.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={attendee.status}
                  onChange={(e) =>
                    handleChangeStatus(
                      attendee.id,
                      e.target.value as ScheduleEventStatus
                    )
                  }
                  className="text-xs rounded-lg border border-gray-300 bg-transparent p-1 dark:border-gray-700 dark:bg-gray-800"
                  disabled={isLoading}
                >
                  <option value="INVITED">Invited</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="DECLINED">Declined</option>
                </select>
                <button
                  onClick={() => handleRemoveAttendee(attendee.id)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  disabled={isLoading}
                >
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <p className="text-sm text-gray-500">No attendees added yet.</p>
        )
      )}
    </div>
  );
};

export default EventAttendeesSection;
