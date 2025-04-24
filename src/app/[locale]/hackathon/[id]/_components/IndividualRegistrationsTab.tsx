// src/app/[locale]/hackathon/[id]/_components/IndividualRegistrationsTab.tsx
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { TeamRequest } from "@/types/entities/teamRequest";
import { useState, useMemo } from "react";
import { Trash2, Plus, AlertCircle } from "lucide-react";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { useApiModal } from "@/hooks/useApiModal";
import { useAuthStore } from "@/store/authStore";

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
  const { showError, showSuccess } = useApiModal();
  const { user } = useAuthStore();

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
        showError(
          "Registration Error",
          `You already have an individual registration for this hackathon with status: ${activeRegistration.status}.`
        );
      } else if (activeTeamRequest) {
        showError(
          "Team Request Exists",
          `You already have a team request for this hackathon with status: ${activeTeamRequest.status}. Please cancel it first to register as an individual.`
        );
      }
      return;
    }

    try {
      setIsLoading(true);

      const requestBody = {
        hackathonId,
        status: "PENDING",
      };

      const response =
        await individualRegistrationRequestService.createIndividualRegistrationRequest(
          requestBody
        );

      if (response.data && response.data.id) {
        showSuccess(
          "Registration Successful",
          "Your individual registration has been submitted successfully."
        );
        onDataUpdate(); // Refresh data
      } else {
        showError(
          "Registration Error",
          "Failed to create individual registration. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating individual registration:", error);
      showError(
        "Registration Error",
        "An unexpected error occurred while creating your registration."
      );
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
      showError(
        "Deletion Error",
        `You can only delete registrations with PENDING status. Current status: ${status}`
      );
      return;
    }

    try {
      setIsLoading(true);
      const response =
        await individualRegistrationRequestService.deleteIndividualRegistration(
          registrationId
        );

      showSuccess(
        "Registration Deleted",
        "Your individual registration has been deleted successfully."
      );
      onDataUpdate(); // Refresh data
    } catch (error) {
      console.error("Error deleting individual registration:", error);
      showError(
        "Deletion Error",
        "Failed to delete individual registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate the warning message based on what's preventing registration
  const getDisabledMessage = () => {
    if (activeRegistration) {
      return `You already have an individual registration with status: ${activeRegistration.status}`;
    }
    if (activeTeamRequest) {
      return `You already have a team request with status: ${activeTeamRequest.status}`;
    }
    return "";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Your Individual Registrations</h4>
        <div className="flex flex-col items-end gap-2">
          {isRegistrationDisabled && !isLoading && (
            <div className="flex items-center text-amber-600 text-sm">
              <AlertCircle size={14} className="mr-1" />
              {getDisabledMessage()}
            </div>
          )}
          <button
            onClick={createIndividualRegistration}
            className={`flex items-center gap-1 ${
              isRegistrationDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-3 py-1 rounded`}
            disabled={isRegistrationDisabled}
          >
            <Plus size={16} />{" "}
            {isLoading ? "Processing..." : "Register as Individual"}
          </button>
        </div>
      </div>

      {individualRegistrations.length === 0 ? (
        <p className="text-gray-500 italic mb-4">
          No individual enrollments found.{" "}
          {!isRegistrationDisabled &&
            "Click the button above to register as an individual."}
        </p>
      ) : (
        <ul className="space-y-3">
          {individualRegistrations.map((reg) => (
            <li
              key={reg.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold">
                    Registration for {reg.hackathon.title}
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reg.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : reg.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : reg.status === "UNDER_REVIEW"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Submitted:</span>{" "}
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </p>
                  {reg.reviewedBy && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Reviewed by:</span>{" "}
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
                      isLoading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700"
                    } transition-colors`}
                    title="Delete registration"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-5 w-5" />
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
