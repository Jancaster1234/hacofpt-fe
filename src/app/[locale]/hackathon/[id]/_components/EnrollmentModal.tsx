// src/app/[locale]/hackathon/[id]/_components/EnrollmentModal.tsx
"use client";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { TeamRequest } from "@/types/entities/teamRequest";
import { Team } from "@/types/entities/team";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import TeamsTab from "./TeamsTab";
import TeamRequestsTab from "./TeamRequestsTab";
import IndividualRegistrationsTab from "./IndividualRegistrationsTab";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";

type EnrollmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  individualRegistrations: IndividualRegistrationRequest[];
  teamRequests: TeamRequest[];
  teams: Team[];
  hackathonId: string;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
  onDataUpdate: () => void;
};

export default function EnrollmentModal({
  isOpen,
  onClose,
  individualRegistrations,
  teamRequests,
  teams,
  hackathonId,
  minimumTeamMembers,
  maximumTeamMembers,
  onDataUpdate,
}: EnrollmentModalProps) {
  const [activeTab, setActiveTab] = useState<
    "teams" | "teamRequests" | "individual"
  >("teams");
  const { user } = useAuthStore();
  const { showError } = useApiModal();
  const t = useTranslations("enrollment");

  // Set initial active tab based on what data exists
  useEffect(() => {
    if (teams.length > 0) {
      setActiveTab("teams");
    } else if (teamRequests.length > 0) {
      setActiveTab("teamRequests");
    } else if (individualRegistrations.length > 0) {
      setActiveTab("individual");
    }
  }, [
    teams.length,
    teamRequests.length,
    individualRegistrations.length,
    isOpen,
  ]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
        aria-labelledby="enrollment-modal-title"
      >
        {/* Modal background and transition */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <Dialog.Title
                  as="h3"
                  id="enrollment-modal-title"
                  className="text-xl font-bold mb-4 text-gray-900 dark:text-white transition-colors"
                >
                  {t("overviewTitle")}
                </Dialog.Title>

                <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto scrollbar-thin">
                  <button
                    onClick={() => setActiveTab("teams")}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base transition-all ${
                      activeTab === "teams"
                        ? "bg-blue-500 text-white dark:bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    aria-selected={activeTab === "teams"}
                    role="tab"
                  >
                    {t("myTeams")}
                  </button>
                  <button
                    onClick={() => setActiveTab("teamRequests")}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base transition-all ${
                      activeTab === "teamRequests"
                        ? "bg-blue-500 text-white dark:bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    aria-selected={activeTab === "teamRequests"}
                    role="tab"
                  >
                    {t("teamRequests")}
                  </button>
                  <button
                    onClick={() => setActiveTab("individual")}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base transition-all ${
                      activeTab === "individual"
                        ? "bg-blue-500 text-white dark:bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    aria-selected={activeTab === "individual"}
                    role="tab"
                  >
                    {t("individualRegistrations")}
                  </button>
                </div>

                <div className="min-h-[300px]" role="tabpanel">
                  {activeTab === "teams" && (
                    <TeamsTab teams={teams} onDataUpdate={onDataUpdate} />
                  )}

                  {activeTab === "teamRequests" && (
                    <TeamRequestsTab
                      teamRequests={teamRequests}
                      individualRegistrations={individualRegistrations}
                      hackathonId={hackathonId}
                      minimumTeamMembers={minimumTeamMembers}
                      maximumTeamMembers={maximumTeamMembers}
                      user={user}
                      onDataUpdate={onDataUpdate}
                    />
                  )}

                  {activeTab === "individual" && (
                    <IndividualRegistrationsTab
                      individualRegistrations={individualRegistrations}
                      teamRequests={teamRequests}
                      hackathonId={hackathonId}
                      onDataUpdate={onDataUpdate}
                    />
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                    aria-label={t("close")}
                  >
                    {t("close")}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
