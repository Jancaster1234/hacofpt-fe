// src/components/calendar/event/EventFilesSection.tsx
import React, { useState, useEffect } from "react";
import { FileUrl } from "@/types/entities/fileUrl";
import { fileUrlService } from "@/services/fileUrl.service";
import { scheduleEventService } from "@/services/scheduleEvent.service";

interface EventFilesSectionProps {
  files: FileUrl[];
  setFiles: (files: FileUrl[]) => void;
  scheduleEventId?: string;
}

const EventFilesSection: React.FC<EventFilesSectionProps> = ({
  files,
  setFiles,
  scheduleEventId,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(50); // Mock progress value
  const [apiMessage, setApiMessage] = useState<string | undefined>(undefined);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    // Fetch files when component mounts and scheduleEventId is available
    if (scheduleEventId) {
      loadFiles();
    }
  }, [scheduleEventId]);

  const loadFiles = async () => {
    if (!scheduleEventId) return;

    try {
      const { data: fileUrls, message } =
        await fileUrlService.getFileUrlsByScheduleEventId(scheduleEventId);
      setFiles(fileUrls);

      if (message) {
        setApiMessage(message);
        setMessageType(fileUrls.length > 0 ? "success" : "error");
      }
    } catch (error: any) {
      console.error("Failed to load event files:", error);
      // Extract message from error response if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load event files";
      setApiMessage(errorMessage);
      setMessageType("error");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0 || !scheduleEventId)
      return;

    setUploading(true);
    setApiMessage(undefined); // Clear previous messages

    try {
      // Convert FileList to File array
      const filesArray = Array.from(selectedFiles);

      // Step 1: Upload files to the communication service
      const { data: uploadedFiles, message: uploadMessage } =
        await fileUrlService.uploadMultipleFilesCommunication(filesArray);

      if (uploadMessage) {
        setApiMessage(uploadMessage);
        setMessageType(uploadedFiles.length > 0 ? "success" : "error");
      }

      // Step 2: Extract fileUrls from the uploaded files
      const fileUrls = uploadedFiles.map((file) => file.fileUrl);

      // Step 3: Associate the uploaded files with the schedule event
      if (fileUrls.length > 0 && scheduleEventId) {
        const { data: associatedFiles, message: associateMessage } =
          await scheduleEventService.createScheduleEventFiles(
            scheduleEventId,
            fileUrls
          );

        if (associateMessage) {
          setApiMessage(associateMessage);
          setMessageType(associatedFiles.length > 0 ? "success" : "error");
        }

        // Step 4: Update local state with the associated files - prevent duplicates by ID
        const updatedFiles = [
          ...files,
          ...associatedFiles.filter(
            (newFile) =>
              !files.some((existingFile) => existingFile.id === newFile.id)
          ),
        ];
        setFiles(updatedFiles);
      }
    } catch (error: any) {
      console.error("Error uploading files:", error);
      // Extract message from error response if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error uploading files";
      setApiMessage(errorMessage);
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    try {
      // Call API to delete file
      const { message } = await fileUrlService.deleteFileUrl(fileId);

      // Update local state
      setFiles(files.filter((file) => file.id !== fileId));

      if (message) {
        setApiMessage(message);
        setMessageType("success");
      }
    } catch (error: any) {
      console.error("Error removing file:", error);
      // Extract message from error response if available
      const errorMessage =
        error.response?.data?.message || error.message || "Error removing file";
      setApiMessage(errorMessage);
      setMessageType("error");
    }
  };

  const handleFileClick = (fileUrl: string) => {
    // Open the file URL in a new tab
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-6">
      <h6 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
        Attachments
      </h6>

      {apiMessage && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            messageType === "error"
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          }`}
        >
          {apiMessage}
          <button
            className="float-right text-xs hover:underline"
            onClick={() => setApiMessage(undefined)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 7v3m0 0v3m0-3h3m-3 0H7m6-4a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h8Z"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Any file type (MAX. 10MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="my-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-brand-500 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Uploading...</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2 mt-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800"
            >
              <div
                className="flex items-center flex-grow cursor-pointer"
                onClick={() => handleFileClick(file.fileUrl)}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg dark:bg-gray-700">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {file.fileName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from bubbling to parent
                  handleRemoveFile(file.id);
                }}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
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
          ))}
        </div>
      )}
    </div>
  );
};

export default EventFilesSection;
