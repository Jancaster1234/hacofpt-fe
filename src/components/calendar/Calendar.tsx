// src/components/calendar/Calendar.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import AddEventModal from "./AddEventModal";
import EditEventModal from "./EditEventModal";
import { Schedule } from "@/types/entities/schedule";
import { useParams } from "next/navigation";
import { addEventToCalendar } from "@/services/scheduleEventService";
import ScheduleMembers from "./ScheduleMembers";
import { User } from "@/types/entities/user";
import { FileUrl } from "@/types/entities/fileUrl";
import { ScheduleEventAttendee } from "@/types/entities/scheduleEventAttendee";
import { ScheduleEventReminder } from "@/types/entities/scheduleEventReminder";
import { scheduleService } from "@/services/schedule.service";
import { scheduleEventService } from "@/services/scheduleEvent.service";
import { teamService } from "@/services/team.service";
import { ScheduleEventLabel } from "@/types/entities/scheduleEvent";
import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    scheduleId?: string;
    description?: string;
    location?: string;
  };
}

interface CalendarProps {
  teamId?: string;
  hackathonId?: string;
}

const Calendar: React.FC<CalendarProps> = ({ teamId, hackathonId }) => {
  // Add translation hook
  const t = useTranslations("calendar");
  // Add toast hook
  const toast = useToast();

  const params = useParams();
  const currentTeamId =
    teamId || (Array.isArray(params.teamId) ? params.teamId[0] : params.teamId);
  const currentHackathonId =
    hackathonId || (Array.isArray(params.id) ? params.id[0] : params.id);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeScheduleId, setActiveScheduleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const calendarRef = useRef<FullCalendar>(null);

  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();
  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const {
    isOpen: isMembersModalOpen,
    openModal: openMembersModal,
    closeModal: closeMembersModal,
  } = useModal();

  // Load team members
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (!currentTeamId || !currentHackathonId) return;

      try {
        setLoading(true);
        // Use the real service call instead of mock
        const { data: team, message } =
          await teamService.getTeamById(currentTeamId);

        if (team && team.teamMembers) {
          // Extract users from team members
          const users = team.teamMembers
            .filter((member) => member.user)
            .map((member) => member.user);

          setTeamMembers(users);
        }
      } catch (error: any) {
        console.error("Failed to fetch team members", error);
        toast.error(error.message || t("errors.failedToFetchMembers"));
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, [currentTeamId, currentHackathonId]);
  // Note: toast is deliberately omitted from dependency array to prevent infinite loops

  // Load basic schedule data when component mounts
  useEffect(() => {
    const loadBasicScheduleData = async () => {
      if (!currentTeamId || !currentHackathonId) return;

      setLoading(true);
      try {
        // Use the real service call instead of mock
        const { data: fetchedSchedules, message } =
          await scheduleService.getSchedulesByTeamIdAndHackathonId(
            currentTeamId,
            currentHackathonId
          );

        // Ensure we have an array
        const schedulesArray = Array.isArray(fetchedSchedules)
          ? fetchedSchedules
          : fetchedSchedules
            ? [fetchedSchedules]
            : [];

        setSchedules(schedulesArray);

        // Set the first schedule as active if we have any
        if (schedulesArray.length > 0 && !activeScheduleId) {
          setActiveScheduleId(schedulesArray[0].id);
        }
      } catch (error: any) {
        console.error("Failed to fetch basic schedule data", error);
        toast.error(error.message || t("errors.failedToFetchSchedules"));
      } finally {
        setLoading(false);
      }
    };

    loadBasicScheduleData();
  }, [currentTeamId, currentHackathonId, activeScheduleId]);
  // Note: toast is deliberately omitted from dependency array to prevent infinite loops

  // Load schedule events only when calendar view changes or schedules are loaded
  const loadScheduleEvents = async () => {
    if (schedules.length === 0) return;

    setLoading(true);
    try {
      const allEvents: CalendarEvent[] = [];

      // For each schedule, fetch its events
      for (const schedule of schedules) {
        // Use the real service call instead of mock
        const { data: scheduleEvents, message } =
          await scheduleEventService.getScheduleEventsByScheduleId(schedule.id);

        // Transform schedule events into calendar events
        const calendarEvents: CalendarEvent[] = scheduleEvents.map((event) => ({
          id: event.id,
          title: event.name,
          start: event.startTime,
          end: event.endTime,
          allDay: false,
          extendedProps: {
            calendar: event.eventLabel?.toLowerCase() || "primary",
            scheduleId: schedule.id,
            description: event.description,
            location: event.location,
          },
        }));

        allEvents.push(...calendarEvents);
      }

      setEvents(allEvents);
    } catch (error: any) {
      console.error("Failed to fetch schedule events", error);
      toast.error(error.message || t("errors.failedToFetchEvents"));
    } finally {
      setLoading(false);
    }
  };

  // Load events when schedules are available
  useEffect(() => {
    if (schedules.length > 0) {
      loadScheduleEvents();
    }
  }, [schedules]);
  // Note: toast is deliberately omitted from dependency array to prevent infinite loops

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedEvent(null);
    openAddModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openEditModal();
  };

  const handleAddEvent = async (eventData: {
    name: string;
    startDate: string;
    endDate: string;
    eventLabel: string;
    description: string;
    location: string;
  }) => {
    if (!activeScheduleId) {
      console.error("No active schedule selected");
      return;
    }

    try {
      setLoading(true);

      // Create event using our service with the real implementation
      const newCalendarEvent = await addEventToCalendar(activeScheduleId, {
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        startTime: eventData.startDate,
        endTime: eventData.endDate,
        eventLabel: eventData.eventLabel as ScheduleEventLabel,
      });

      // Add the new event to the state
      setEvents((prevEvents) => [...prevEvents, newCalendarEvent]);

      // Refresh events from server to ensure we have the latest data
      await loadScheduleEvents();

      closeAddModal();
    } catch (error) {
      console.error("Failed to add event:", error);
      alert("Failed to add event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update the handleUpdateEvent function in Calendar.tsx
  const handleUpdateEvent = async (eventData: {
    name: string;
    startDate: string;
    endDate: string;
    eventLabel: string;
    description: string;
    location: string;
    files: FileUrl[];
    attendees: ScheduleEventAttendee[];
    reminders: ScheduleEventReminder[];
  }) => {
    if (!selectedEvent) return;

    try {
      setLoading(true);

      // Update local state first for immediate feedback
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventData.name,
                start: new Date(eventData.startDate),
                end: new Date(eventData.endDate),
                extendedProps: {
                  ...event.extendedProps,
                  calendar: eventData.eventLabel,
                  description: eventData.description,
                  location: eventData.location,
                  files: eventData.files,
                  attendees: eventData.attendees,
                  reminders: eventData.reminders,
                },
              }
            : event
        )
      );

      // Refresh events from server to ensure we have the latest data
      await loadScheduleEvents();

      closeEditModal();
    } catch (error) {
      console.error("Failed to update event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setLoading(true);

      // Call the API to delete the event
      const { message } =
        await scheduleEventService.deleteScheduleEvent(eventId);

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );

      // Show success toast
      toast.success(t("success.eventDeleted"));

      closeEditModal();
    } catch (error: any) {
      console.error("Failed to delete event:", error);
      toast.error(error.message || t("errors.failedToDeleteEvent"));
    } finally {
      setLoading(false);
    }
  };

  const labelColorMap = {
    danger: "#dc3545",
    success: "#28a745",
    primary: "#007bff",
    warning: "#ffc107",
  };

  const renderEventTooltip = (eventInfo: EventContentArg) => {
    const event = eventInfo.event;
    const extendedProps = event.extendedProps as CalendarEvent["extendedProps"];
    const eventLabel = extendedProps.calendar.toLowerCase();
    const baseColor =
      labelColorMap[eventLabel as keyof typeof labelColorMap] || "#007bff";

    // Convert hex color to rgba to add opacity
    const hexToRgba = (hex: string, opacity: number) => {
      // Remove the hash if it exists
      hex = hex.replace("#", "");

      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Return rgba format
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    // Add opacity (0.8 = 80% opacity)
    const backgroundColor = hexToRgba(baseColor, 0.8);

    return (
      <div
        className="event-tooltip flex p-1.5 rounded-md max-w-full transition-colors duration-300"
        style={{
          backgroundColor,
          color: ["warning"].includes(eventLabel) ? "#212529" : "#ffffff",
          // Add a subtle border of the original color for better definition
          border: `1px solid ${baseColor}`,
        }}
      >
        <div className="flex flex-col w-full">
          <div className="font-bold truncate">{event.title}</div>
          {extendedProps.description && (
            <div className="text-xs truncate">{extendedProps.description}</div>
          )}
          {extendedProps.location && (
            <div className="text-xs italic truncate">
              {t("location")}: {extendedProps.location}
            </div>
          )}
          <div className="text-xs truncate">
            {event.start?.toLocaleString()} - {event.end?.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  const handleScheduleSelect = (scheduleId: string) => {
    setActiveScheduleId(scheduleId);
  };

  // Get current active schedule
  const activeSchedule = schedules.find(
    (schedule) => schedule.id === activeScheduleId
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="p-3 sm:p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">{t("teamSchedule")}</h2>

          {/* Members display */}
          <div className="flex items-center mt-2 md:mt-0">
            <div className="flex -space-x-2 mr-2">
              {teamMembers.slice(0, 3).map((user) => (
                <div key={user.id} className="relative h-7 w-7 sm:h-8 sm:w-8">
                  {user.avatarUrl ? (
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 transition-colors duration-300 relative">
                      <Image
                        src={user.avatarUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-sm font-medium transition-colors duration-300"
                      title={`${user.firstName} ${user.lastName}`}
                    >
                      {user.firstName?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              ))}
              {teamMembers.length > 3 && (
                <div
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium cursor-pointer transition-colors duration-300"
                  onClick={openMembersModal}
                >
                  +{teamMembers.length - 3}
                </div>
              )}
            </div>
            <button
              onClick={openMembersModal}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors duration-300"
            >
              {t("viewMembers")}
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <LoadingSpinner size="md" showText={true} />
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {t("loadingSchedule")}
            </p>
          </div>
        )}

        {!loading && schedules.length > 0 && (
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              {t("schedules")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className={`bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg cursor-pointer border-2 transition-all duration-300 hover:shadow-md ${
                    activeScheduleId === schedule.id
                      ? "border-brand-500 dark:border-brand-400"
                      : "border-transparent"
                  }`}
                  onClick={() => handleScheduleSelect(schedule.id)}
                >
                  <h4 className="font-medium text-sm sm:text-base">
                    {schedule.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {schedule.description}
                  </p>
                  {schedule.team && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("team")}: {schedule.team.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="custom-calendar px-2 sm:px-4 pb-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventTooltip}
          datesSet={() => {
            // Optionally refresh events when date range changes
            // loadScheduleEvents();
          }}
          customButtons={{
            addEventButton: {
              text: `${t("addEvent")} +`,
              click: openAddModal,
            },
          }}
          // Add these options to enforce max height and handle overflow
          eventMaxStack={3}
          height="auto"
          // Add these options to apply default styling to events
          eventClassNames="overflow-hidden transition-colors duration-300"
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
        />
      </div>
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        scheduleId={activeScheduleId || ""}
        onAddEvent={handleAddEvent}
      />
      {selectedEvent && (
        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          selectedEvent={selectedEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          teamMembers={teamMembers}
        />
      )}
      <ScheduleMembers
        isOpen={isMembersModalOpen}
        onClose={closeMembersModal}
        members={teamMembers}
        scheduleName={activeSchedule?.name || t("schedule")}
      />
    </div>
  );
};

export default Calendar;
