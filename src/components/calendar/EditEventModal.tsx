// src/components/calendar/EditEventModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { CalendarEvent } from "./Calendar";
import { useAuth } from "@/hooks/useAuth_v0";
import { User } from "@/types/entities/user";
import { FileUrl } from "@/types/entities/fileUrl";
import { ScheduleEventAttendee } from "@/types/entities/scheduleEventAttendee";
import { ScheduleEventReminder } from "@/types/entities/scheduleEventReminder";
import { ScheduleEventLabel } from "@/types/entities/scheduleEvent";
import EventInformationSection from "./event/EventInformationSection";
import EventFilesSection from "./event/EventFilesSection";
import EventAttendeesSection from "./event/EventAttendeesSection";
import EventRemindersSection from "./event/EventRemindersSection";
import { scheduleEventService } from "@/services/scheduleEvent.service";
import { fileUrlService } from "@/services/fileUrl.service";
import { scheduleEventAttendeeService } from "@/services/scheduleEventAttendee.service";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: CalendarEvent;
  onUpdateEvent: (eventData: {
    name: string;
    startDate: string;
    endDate: string;
    eventLabel: ScheduleEventLabel;
    description: string;
    location: string;
    files: FileUrl[];
    attendees: ScheduleEventAttendee[];
    reminders: ScheduleEventReminder[];
  }) => void;
  onDeleteEvent: (eventId: string) => void;
  teamMembers: User[];
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  onUpdateEvent,
  onDeleteEvent,
  teamMembers,
}) => {
  const { user } = useAuth();

  // Event basic information
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLabel, setEventLabel] = useState<ScheduleEventLabel>("primary");
  const [scheduleId, setScheduleId] = useState<string>("");

  // Event additional data
  const [files, setFiles] = useState<FileUrl[]>([]);
  const [attendees, setAttendees] = useState<ScheduleEventAttendee[]>([]);
  const [reminders, setReminders] = useState<ScheduleEventReminder[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Current tab
  const [activeTab, setActiveTab] = useState("information");

  // Load event files
  const loadEventFiles = async () => {
    if (!selectedEvent?.id) return;

    try {
      const { data } = await fileUrlService.getFileUrlsByScheduleEventId(
        selectedEvent.id
      );
      setFiles(data);
    } catch (error) {
      console.error("Failed to load event files", error);
    }
  };

  // Load event attendees
  const loadEventAttendees = async () => {
    if (!selectedEvent?.id) return;

    try {
      const { data } =
        await scheduleEventAttendeeService.getAttendeesByScheduleEventId(
          selectedEvent.id
        );
      setAttendees(data);
    } catch (error) {
      console.error("Failed to load event attendees", error);
    }
  };

  useEffect(() => {
    // Populate modal fields when selectedEvent changes and modal is open
    if (isOpen && selectedEvent) {
      // Basic event info
      setEventName(selectedEvent.title || "");

      // Convert Date objects to datetime-local input format (YYYY-MM-DDThh:mm)
      const formatDateTime = (date: Date | string | undefined) => {
        if (!date) return "";
        const d = date instanceof Date ? date : new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      };

      setEventStartDate(formatDateTime(selectedEvent.start));
      setEventEndDate(formatDateTime(selectedEvent.end));

      // Map calendar value to eventLabel
      const calendarValue = selectedEvent.extendedProps?.calendar || "primary";
      setEventLabel(calendarValue as ScheduleEventLabel);

      // Additional event info from extendedProps
      setEventDescription(selectedEvent.extendedProps?.description || "");
      setEventLocation(selectedEvent.extendedProps?.location || "");

      // Set schedule ID
      setScheduleId(selectedEvent.extendedProps?.scheduleId || "");

      // Load event files via API
      loadEventFiles();

      // Load event attendees via API
      loadEventAttendees();

      // Remove this line since we're now loading from API
      // setAttendees(selectedEvent.extendedProps?.attendees || []);
      // For demo purposes, we'll initialize these arrays
      // In a real app, you would fetch this data from your backend
      setReminders(selectedEvent.extendedProps?.reminders || []);
    }
  }, [selectedEvent, isOpen]);

  const handleSubmit = async () => {
    if (!selectedEvent?.id || !scheduleId) {
      console.error("Missing event ID or schedule ID");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Update the basic event information
      const { data: updatedEvent } =
        await scheduleEventService.updateScheduleEventInformation(
          selectedEvent.id,
          {
            scheduleId: scheduleId,
            name: eventName,
            description: eventDescription,
            location: eventLocation,
            startTime: eventStartDate,
            endTime: eventEndDate || eventStartDate,
            eventLabel: eventLabel,
            isRecurring: false,
            recurrenceRule: undefined,
          }
        );

      // Step 2: Handle the file associations if there are new files that need to be associated
      // Note: This step is now handled directly in the EventFilesSection component
      // when files are uploaded, so we don't need to do it again here

      // Update UI via the callback
      onUpdateEvent({
        name: eventName,
        startDate: eventStartDate,
        endDate: eventEndDate || eventStartDate,
        eventLabel: eventLabel,
        description: eventDescription,
        location: eventLocation,
        files: files,
        attendees: attendees,
        reminders: reminders,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tab navigation
  const tabs = [
    { id: "information", label: "Information" },
    { id: "attendees", label: "Attendees" },
    { id: "files", label: "Files" },
    { id: "reminders", label: "Reminders" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Edit Event
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Modify the details of your existing event
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === tab.id
                  ? "text-brand-500 border-b-2 border-brand-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "information" && (
            <EventInformationSection
              eventName={eventName}
              setEventName={setEventName}
              eventDescription={eventDescription}
              setEventDescription={setEventDescription}
              eventLocation={eventLocation}
              setEventLocation={setEventLocation}
              eventLabel={eventLabel}
              setEventLabel={setEventLabel}
              eventStartDate={eventStartDate}
              setEventStartDate={setEventStartDate}
              eventEndDate={eventEndDate}
              setEventEndDate={setEventEndDate}
            />
          )}

          {activeTab === "attendees" && (
            <EventAttendeesSection
              attendees={attendees}
              setAttendees={setAttendees}
              teamMembers={teamMembers}
              scheduleEventId={selectedEvent?.id}
            />
          )}

          {activeTab === "files" && (
            <EventFilesSection
              files={files}
              setFiles={setFiles}
              scheduleEventId={selectedEvent?.id}
            />
          )}

          {activeTab === "reminders" && (
            <EventRemindersSection
              reminders={reminders}
              setReminders={setReminders}
              scheduleEventId={selectedEvent?.id}
            />
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-between">
          <button
            onClick={() => onDeleteEvent(selectedEvent.id as string)}
            type="button"
            className="flex justify-center rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            disabled={isLoading}
          >
            Delete Event
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              type="button"
              className="flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="btn btn-success btn-update-event flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditEventModal;
