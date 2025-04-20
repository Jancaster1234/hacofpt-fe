// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskAttachments.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { FileUrl } from "@/types/entities/fileUrl";
import { formatDistance } from "date-fns";
import { fileUrlService } from "@/services/fileUrl.service";
import { taskService } from "@/services/task.service";

interface TaskAttachmentsProps {
  files: FileUrl[];
  taskId: string;
  onAddFile?: (file: FileUrl) => void;
  onRemoveFile?: (fileId: string) => void;
  onError?: (error: string) => void;
}

export default function TaskAttachments({
  files,
  taskId,
  onAddFile,
  onRemoveFile,
  onError,
}: TaskAttachmentsProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);

      // 1. Upload file to get FileUrl object
      const { data: uploadedFiles, message } =
        await fileUrlService.uploadMultipleFilesCommunication([file]);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error("Failed to upload file");
      }

      // 2. Get the fileUrl strings from the response
      const fileUrls = uploadedFiles.map((file) => file.fileUrl);

      // 3. Associate files with the task
      const { data: attachedFiles } = await taskService.createTaskFiles(
        taskId,
        fileUrls
      );

      // 4. Notify parent component if callback is provided
      if (attachedFiles && attachedFiles.length > 0 && onAddFile) {
        onAddFile(attachedFiles[0]);
      }

      return attachedFiles;
    } catch (error) {
      console.error("Error uploading file:", error);
      if (onError) onError("Failed to upload file. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    try {
      await fileUrlService.deleteFileUrl(fileId);
      if (onRemoveFile) onRemoveFile(fileId);
    } catch (error) {
      console.error("Error removing file:", error);
      if (onError) onError("Failed to remove file. Please try again.");
    }
  };

  // Always render the component, even with no files
  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="mr-2">📎</span>
        Attachments ({files.length})
      </h3>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-start border-b border-gray-200 pb-2"
            >
              {/* File preview/icon */}
              <div className="mr-3 mt-1">
                {file.fileType.startsWith("image/") ? (
                  <div className="relative w-10 h-10">
                    <Image
                      src={file.fileUrl}
                      alt={file.fileName}
                      fill
                      sizes="40px"
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-xs">File</span>
                  </div>
                )}
              </div>

              {/* File details */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-sm">{file.fileName}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistance(
                      new Date(file.createdAt || ""),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {(file.fileSize / 1024).toFixed(1)} KB
                </div>
                <div className="mt-1 flex space-x-2">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && !isUploading && (
        <p className="text-sm text-gray-500 mb-3">No attachments yet</p>
      )}

      {isUploading && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Uploading...</span>
        </div>
      )}

      <div className="mt-3">
        <label className="cursor-pointer inline-block">
          <div className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">
            Add Attachment
          </div>
          <input
            type="file"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </label>
      </div>
    </div>
  );
}
