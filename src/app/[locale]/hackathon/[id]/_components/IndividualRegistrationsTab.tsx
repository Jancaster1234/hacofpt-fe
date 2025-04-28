// src/app/[locale]/hackathon/[id]/_components/IndividualRegistrationsTab.tsx
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { TeamRequest } from "@/types/entities/teamRequest";
import { useState, useMemo } from "react";
import { Trash2, Plus, AlertCircle, Loader2 } from "lucide-react";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { useApiModal } from "@/hooks/useApiModal";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

type IndividualRegistrationsTabProps = {
  individualRegistrations: IndividualRegistrationRequest[];
  teamRequests: TeamRequest[];
  hackathonId: string;
  onDataUpdate: () => void;
};

export default function IndividualRegistrationsTab({
  individualRegistrations,
  teamRequests,
  hackathonId,
  onDataUpdate,
}: IndividualRegistrationsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showError, showSuccess } = useApiModal();
  const { user } = useAuthStore();
  const t = useTranslations("individualRegistration");
  const toast = useToast();

  // Check for active individual registrations and team requests
  const activeRegistration = useMemo(
    () =>
      individualRegistrations.find(
        (reg) =>
          reg.status === "PENDING" ||
          reg.status === "APPROVED" ||
          reg.status === "UNDER_REVIEW"
      ),
    [individualRegistrations]
  );

  const activeTeamRequest = useMemo(
    () =>
      teamRequests.find(
        (req) =>
          req.status.toLowerCase() === "pending" ||
          req.status.toLowerCase() === "under_review" ||
          req.status.toLowerCase() === "approved"
      ),
    [teamRequests]
  );

  // Determine if registration button should be disabled
  const isRegistrationDisabled = useMemo(
    () => !!activeRegistration || !!activeTeamRequest || isLoading,
    [activeRegistration, activeTeamRequest, isLoading]
  );

  // Create individual registration
  const createIndividualRegistration = async () => {
    if (isRegistrationDisabled) {
      // Show appropriate error message based on the reason
      if (activeRegistration) {
        toast.error(
          t("errorAlreadyRegisteredIndividual", {
            status: activeRegistration.status,
          })
        );
      } else if (activeTeamRequest) {
        toast.error(
          t("errorAlreadyTeamRequest", { status: activeTeamRequest.status })
        );
      }
      return;
    }

    try {
      setIsLoading(true);
      // Removed toast for data fetching

      const requestBody = {
        hackathonId,
        status: "PENDING",
      };

      const response =
        await individualRegistrationRequestService.createIndividualRegistrationRequest(
          requestBody
        );

      if (response.data && response.data.id) {
        // Keep toast for successful user action
        toast.success(t("registrationSuccess"));
        onDataUpdate(); // Refresh data
      } else {
        // Keep toast for error from user action
        toast.error(response.message || t("registrationError"));
      }
    } catch (error) {
      console.error("Error creating individual registration:", error);
      toast.error(t("registrationErrorUnexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIndividualRegistration = async (
    registrationId: string,
    status: string
  ) => {
    // Only allow deletion of PENDING registrations
    if (status !== "PENDING") {
      toast.error(t("deletionErrorNonPending", { status }));
      return;
    }

    try {
      setDeletingId(registrationId);
      // Removed toast for data fetching

      const response =
        await individualRegistrationRequestService.deleteIndividualRegistration(
          registrationId
        );

      // Keep toast for successful user action
      toast.success(t("registrationDeleted"));
      onDataUpdate(); // Refresh data
    } catch (error: any) {
      console.error("Error deleting individual registration:", error);
      toast.error(error.message || t("deletionError"));
    } finally {
      setDeletingId(null);
    }
  };

  // Generate the warning message based on what's preventing registration
  const getDisabledMessage = () => {
    if (activeRegistration) {
      return t("warningExistingRegistration", {
        status: activeRegistration.status,
      });
    }
    if (activeTeamRequest) {
      return t("warningExistingTeamRequest", {
        status: activeTeamRequest.status,
      });
    }
    return "";
  };

  // Format date according to locale
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status class name based on status
  const getStatusClassName = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "UNDER_REVIEW":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
    }
  };

  return (
    <div className="transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {t("yourRegistrations")}
        </h4>
        <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
          {isRegistrationDisabled && !isLoading && (
            <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
              <AlertCircle size={14} className="mr-1 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{getDisabledMessage()}</span>
            </div>
          )}
          <button
            onClick={createIndividualRegistration}
            className={`flex items-center gap-1 w-full sm:w-auto justify-center ${
              isRegistrationDisabled
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            } text-white px-3 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
            disabled={isRegistrationDisabled}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" showText={false} />
            ) : (
              <Plus size={16} />
            )}
            {isLoading ? t("processing") : t("registerAsIndividual")}
          </button>
        </div>
      </div>

      {individualRegistrations.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic mb-4 text-center py-8">
          {t("noRegistrationsFound")}{" "}
          {!isRegistrationDisabled && t("clickToRegister")}
        </p>
      ) : (
        <ul className="space-y-3">
          {individualRegistrations.map((reg) => (
            <li
              key={reg.id}
              className="border border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800/50"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {t("registrationFor", { title: reg.hackathon.title })}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <span className="font-medium">{t("status")}:</span>{" "}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClassName(
                        reg.status
                      )}`}
                    >
                      {t(`status${reg.status}`)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <span className="font-medium">{t("submitted")}:</span>{" "}
                    {formatDate(reg.createdAt)}
                  </p>
                  {reg.reviewedBy && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      <span className="font-medium">{t("reviewedBy")}:</span>{" "}
                      {reg.reviewedBy.firstName} {reg.reviewedBy.lastName}
                    </p>
                  )}
                </div>
                {/* Only show delete button for PENDING status */}
                {reg.status === "PENDING" && (
                  <button
                    onClick={() =>
                      deleteIndividualRegistration(reg.id, reg.status)
                    }
                    className={`${
                      deletingId === reg.id
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    } transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1`}
                    title={t("deleteRegistration")}
                    disabled={deletingId === reg.id}
                    aria-label={t("deleteRegistration")}
                  >
                    {deletingId === reg.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
