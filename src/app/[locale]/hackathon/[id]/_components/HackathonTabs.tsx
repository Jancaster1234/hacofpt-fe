// src/app/[locale]/hackathon/[id]/_components/HackathonTabs.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useTranslations } from "@/hooks/useTranslations";
import { TeamParticipantsTab } from "./TeamParticipantsTab";
import { IndividualParticipantsTab } from "./IndividualParticipantsTab";
import TiptapRenderer from "@/components/TiptapRenderer/ClientRenderer";
import PostContent from "@/components/shared/PostContent";
import PostToc from "@/components/shared/PostToc";

type TabKey =
  | "information"
  | "description"
  | "participant"
  | "documentation"
  | "contact";

export default function HackathonTabs({
  content,
  hackathonId,
}: {
  content: Record<TabKey, string | string[]>;
  hackathonId: string;
}) {
  const t = useTranslations("hackathonTabs");
  const [activeTab, setActiveTab] = useState<TabKey>("information");
  const [participantSubTab, setParticipantSubTab] = useState<
    "teams" | "individuals"
  >("teams");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "information", label: t("tabs.information") },
    { key: "description", label: t("tabs.description") },
    { key: "participant", label: t("tabs.participant") },
    { key: "documentation", label: t("tabs.documentation") },
    { key: "contact", label: t("tabs.contact") },
  ];

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabKey;
    if (tabs.some((tab) => tab.key === hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key);
    window.location.hash = key; // Update URL hash
  };

  // Helper to determine if the tab should use the PostContent/PostToc layout
  const shouldUsePostLayout = (tabKey: TabKey) => {
    return ["information", "description", "contact"].includes(tabKey);
  };

  // Render content with PostContent and PostToc layout
  const renderPostLayout = (tabContent: string) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
      {/* Main content area - takes full width on small screens, 2/3 on larger screens */}
      <div className="lg:col-span-2 lg:ml-8 md:ml-4 sm:ml-2 transition-all duration-300 overflow-x-auto">
        <PostContent>
          <div className="dark:prose-invert prose-img:rounded prose-headings:scroll-mt-28 max-w-full overflow-x-auto">
            <TiptapRenderer>{tabContent}</TiptapRenderer>
          </div>
        </PostContent>
      </div>

      {/* Table of Contents - only visible on larger screens */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <PostToc />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <style>{`
          /* Core styles to handle overflow content properly */
          table {
            max-width: 100%;
            overflow-x: auto;
            display: block;
          }
          
          @media (max-width: 640px) {
            .prose table {
              font-size: 0.8rem;
            }
          }
          
          /* Ensure all content stays within bounds */
          .prose img, .prose pre, .prose iframe {
            max-width: 100%;
          }
        `}</style>
      </Head>
      <div className="mt-4 sm:mt-6 transition-all duration-300">
        {/* Tab Buttons */}
        <div className="flex overflow-x-auto scrollbar-hide border-b dark:border-gray-700">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              className={`px-3 py-2 sm:px-4 text-sm sm:text-lg whitespace-nowrap transition-all duration-200 ${
                activeTab === key
                  ? "border-b-2 border-blue-500 dark:border-blue-400 font-semibold text-gray-900 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4 p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm transition-colors duration-300 overflow-hidden">
          {activeTab === "participant" ? (
            <div>
              {/* Participant Subtabs */}
              <div className="flex mb-4 border-b dark:border-gray-700 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setParticipantSubTab("teams")}
                  className={`px-3 py-2 sm:px-4 text-sm whitespace-nowrap transition-all duration-200 ${
                    participantSubTab === "teams"
                      ? "border-b-2 border-blue-500 dark:border-blue-400 font-medium text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {t("subtabs.teams")}
                </button>
                <button
                  onClick={() => setParticipantSubTab("individuals")}
                  className={`px-3 py-2 sm:px-4 text-sm whitespace-nowrap transition-all duration-200 ${
                    participantSubTab === "individuals"
                      ? "border-b-2 border-blue-500 dark:border-blue-400 font-medium text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {t("subtabs.individuals")}
                </button>
              </div>

              {/* Participant Content based on subtab */}
              {participantSubTab === "teams" ? (
                <TeamParticipantsTab hackathonId={hackathonId} />
              ) : (
                <IndividualParticipantsTab hackathonId={hackathonId} />
              )}
            </div>
          ) : shouldUsePostLayout(activeTab) &&
            typeof content[activeTab] === "string" ? (
            // Use PostContent/PostToc layout for information, description and contact tabs
            renderPostLayout(content[activeTab] as string)
          ) : Array.isArray(content[activeTab]) ? (
            // Documentation tab (list of links)
            <div className="lg:ml-8 md:ml-4 sm:ml-2 transition-all duration-300 overflow-x-auto">
              <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200">
                {(content[activeTab] as string[]).map((doc, index) => (
                  <li key={index} className="mb-1">
                    <a
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline focus:underline focus:outline-none transition-colors duration-200"
                    >
                      {doc}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            // Fallback rendering for other content
            <div className="lg:ml-8 md:ml-4 sm:ml-2 transition-all duration-300 overflow-x-auto">
              <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                {content[activeTab] as string}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
