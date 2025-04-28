// src/app/[locale]/dashboard/individual-registration/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { ChevronDown, ChevronUp, Trash2, Moon, Sun } from "lucide-react";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function IndividualRegistrationPage() {
  const { user } = useAuth();
  const [individualRegistrations, setIndividualRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [expandedHackathons, setExpandedHackathons] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { modalState, hideModal, showSuccess, showError } = useApiModal();
  const toast = useToast();
  const t = useTranslations("individualRegistration");

  useEffect(() => {
    if (user) {
      fetchIndividualRegistrations();
    }
  }, [user]);

  const fetchIndividualRegistrations = async () => {
    if (!user?.username) return;

    setIsLoading(true);
    try {
      const response =
        await individualRegistrationRequestService.getIndividualRegistrationRequestsByUser(
          user.username
        );

      if (response.data) {
        setIndividualRegistrations(response.data);
      } else {
        toast.error(response.message || t("errors.fetchFailed"));
        showError(
          t("errors.fetchFailedTitle"),
          response.message || t("errors.fetchFailedMessage")
        );
      }
    } catch (error: any) {
      toast.error(error?.message || t("errors.fetchFailed"));
      showError(
        t("errors.errorTitle"),
        error?.message || t("errors.fetchFailedMessage")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (hackathonId: string) => {
    setExpandedHackathons((prev) => ({
      ...prev,
      [hackathonId]: !prev[hackathonId],
    }));
  };

  const handleDeleteRegistration = async (registrationId: string) => {
    setIsLoading(true);
    try {
      const response =
        await individualRegistrationRequestService.deleteIndividualRegistration(
          registrationId
        );

      setIndividualRegistrations((prevRegistrations) =>
        prevRegistrations.filter(
          (registration) => registration.id !== registrationId
        )
      );

      toast.success(response.message || t("success.registrationCancelled"));
      showSuccess(
        t("success.registrationCancelledTitle"),
        response.message || t("success.registrationCancelledMessage")
      );
    } catch (error: any) {
      toast.error(error?.message || t("errors.cancellationFailed"));
      showError(
        t("errors.cancellationFailedTitle"),
        error?.message || t("errors.cancellationFailedMessage")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Group individual registrations by hackathon
  const groupedRegistrations = individualRegistrations.reduce(
    (acc, registration) => {
      if (!registration.hackathon) return acc;
      const hackathonId = registration.hackathon.id;
      if (!acc[hackathonId]) {
        acc[hackathonId] = {
          title: registration.hackathon.title,
          registrations: [],
        };
      }
      acc[hackathonId].registrations.push(registration);
      return acc;
    },
    {} as Record<
      string,
      { title: string; registrations: IndividualRegistrationRequest[] }
    >
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 dark:text-green-400";
      case "REJECTED":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="mt-6 w-full max-w-3xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {t("title")}
        </h1>

        {isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
            <LoadingSpinner size="md" showText={true} />
            <p className="mt-2">{t("loading")}</p>
          </div>
        )}

        {!isLoading && Object.entries(groupedRegistrations).length > 0
          ? Object.entries(groupedRegistrations).map(
              ([hackathonId, { title, registrations }]) => {
                return (
                  <div
                    key={hackathonId}
                    className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors duration-300"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(hackathonId)}
                    >
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        {title}
                      </h2>
                      {expandedHackathons[hackathonId] ? (
                        <ChevronUp className="text-gray-600 dark:text-gray-300" />
                      ) : (
                        <ChevronDown className="text-gray-600 dark:text-gray-300" />
                      )}
                    </div>

                    {expandedHackathons[hackathonId] && (
                      <div className="mt-3 space-y-3">
                        {registrations.map((registration) => (
                          <div
                            key={registration.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 transition-colors duration-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                  <strong>{t("registrationId")}:</strong>{" "}
                                  {registration.id}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                  <strong>{t("status")}:</strong>{" "}
                                  <span
                                    className={getStatusColor(
                                      registration.status
                                    )}
                                  >
                                    {registration.status}
                                  </span>
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                  <strong>{t("created")}:</strong>{" "}
                                  {formatDate(registration.createdAt)}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                  <strong>{t("lastUpdated")}:</strong>{" "}
                                  {formatDate(registration.updatedAt)}
                                </p>
                              </div>

                              {registration.status === "PENDING" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRegistration(registration.id);
                                  }}
                                  disabled={isLoading}
                                  className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-md text-white disabled:bg-red-300 dark:disabled:bg-red-400 transition-colors duration-200 text-sm sm:text-base"
                                  title={t("cancelRegistration")}
                                >
                                  <Trash2 size={16} />
                                  <span>{t("cancel")}</span>
                                </button>
                              )}
                            </div>

                            {registration.reviewedBy && (
                              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded transition-colors duration-300">
                                <p className="text-gray-700 dark:text-gray-200 text-sm">
                                  <strong>{t("reviewedBy")}:</strong>{" "}
                                  {registration.reviewedBy.firstName}{" "}
                                  {registration.reviewedBy.lastName}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            )
          : !isLoading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                {t("noRegistrations")}
              </div>
            )}
      </div>

      {/* API Response Modal Integration */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
