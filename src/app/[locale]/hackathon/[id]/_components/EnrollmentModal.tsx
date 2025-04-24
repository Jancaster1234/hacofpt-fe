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
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Modal background and transition */}
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-xl font-bold mb-4">
                Enrollment Overview
              </Dialog.Title>

              <div className="flex gap-2 mb-4 border-b pb-2">
                <button
                  onClick={() => setActiveTab("teams")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "teams"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  My Teams
                </button>
                <button
                  onClick={() => setActiveTab("teamRequests")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "teamRequests"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Team Requests
                </button>
                <button
                  onClick={() => setActiveTab("individual")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "individual"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Individual Registrations
                </button>
              </div>

              {activeTab === "teams" && (
                <TeamsTab teams={teams} onDataUpdate={onDataUpdate} />
              )}

              {activeTab === "teamRequests" && (
                <TeamRequestsTab
                  teamRequests={teamRequests}
                  individualRegistrations={individualRegistrations} // Pass this prop
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
                  teamRequests={teamRequests} // Pass this prop
                  hackathonId={hackathonId}
                  onDataUpdate={onDataUpdate}
                />
              )}

              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
