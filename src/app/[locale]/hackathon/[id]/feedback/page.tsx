// src/app/[locale]/hackathon/[id]/feedback/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { useRouter, useParams } from "next/navigation";
import { Tab } from "@headlessui/react";
import { feedbackService } from "@/services/feedback.service";
import { feedbackDetailService } from "@/services/feedbackDetail.service";
import { hackathonService } from "@/services/hackathon.service";
import { teamService } from "@/services/team.service";
import { mentorTeamService } from "@/services/mentorTeam.service";
import { userService } from "@/services/user.service";
import { Feedback } from "@/types/entities/feedback";
import { FeedbackDetail } from "@/types/entities/feedbackDetail";
import { User } from "@/types/entities/user";
import { Team } from "@/types/entities/team";
import { Hackathon } from "@/types/entities/hackathon";
import { MentorTeam } from "@/types/entities/mentorTeam";
import FeedbackForm from "./_components/FeedbackForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";

export default function HackathonFeedback() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const hackathonId = params.id as string;
  const toast = useToast();
  const t = useTranslations("hackathonFeedback");

  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [hackathonFeedback, setHackathonFeedback] = useState<Feedback | null>(
    null
  );
  const [mentorFeedbacks, setMentorFeedbacks] = useState<{
    [mentorId: string]: Feedback;
  }>({});
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Load necessary data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.email || !hackathonId) {
        setLoading(false);
        return;
      }

      try {
        // Get hackathon details
        const response = await hackathonService.getHackathonById(hackathonId);
        const hackathon = response.data.length > 0 ? response.data[0] : null;
        setHackathon(hackathon);

        // Get user's teams for this hackathon
        if (user.id) {
          const { data: teams } = await teamService.getTeamsByUserAndHackathon(
            user.id,
            hackathonId
          );
          setUserTeams(teams);

          // For each team, get mentor assignments
          if (teams.length > 0) {
            const team = teams[0]; // Using first team for now
            const { data: mentorTeams } =
              await mentorTeamService.getMentorTeamsByHackathonAndTeam(
                hackathonId,
                team.id
              );

            // Fetch mentor details and feedback for each mentor
            const mentorsData: User[] = [];
            const mentorFeedbacksData: { [mentorId: string]: Feedback } = {};

            for (const mentorTeam of mentorTeams) {
              if (mentorTeam.mentorId) {
                const { data: mentorData } = await userService.getUserById(
                  mentorTeam.mentorId
                );
                mentorsData.push(mentorData);

                try {
                  const { data: mentorFeedback } =
                    await feedbackService.getFeedbackByMentorIdAndHackathonId(
                      mentorTeam.mentorId,
                      hackathonId
                    );
                  mentorFeedbacksData[mentorTeam.mentorId] = mentorFeedback;
                } catch (error) {
                  console.log(
                    `No feedback found for mentor ${mentorTeam.mentorId}`
                  );
                }
              }
            }

            setMentors(mentorsData);
            setMentorFeedbacks(mentorFeedbacksData);
          }
        }

        // Get hackathon feedback (general feedback form)
        try {
          const { data: feedbacks } =
            await feedbackService.getFeedbacksByHackathonId(hackathonId);
          // Filter for the general hackathon feedback (no mentorId)
          const generalFeedback = feedbacks.find((f) => !f.mentorId);
          if (generalFeedback) {
            setHackathonFeedback(generalFeedback);
          }
        } catch (error) {
          console.log("No general hackathon feedback found");
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        // No toast here as this is initial data loading, not user action
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, hackathonId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <LoadingSpinner size="lg" showText={true} />
      </div>
    );
  }

  // Prepare tabs data
  const tabs = [
    { name: t("hackathonFeedback"), feedback: hackathonFeedback },
    ...mentors.map((mentor, index) => ({
      name: `${mentor.firstName} ${mentor.lastName} (${t("mentor")})`,
      feedback: mentorFeedbacks[mentor.id],
    })),
  ].filter((tab) => tab.feedback); // Only show tabs with available feedback

  if (tabs.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
        <div className="mx-auto w-full max-w-3xl text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("hackathonFeedback")}
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("noFeedbackAvailable")}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-md bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t("returnToDashboard")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("hackathonFeedback")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("greeting", {
              name: user
                ? `${user.firstName} ${user.lastName}`
                : t("participant"),
            })}
          </p>
        </div>

        <Tab.Group onChange={setActiveTabIndex}>
          <Tab.List className="flex flex-wrap rounded-xl bg-blue-50 dark:bg-blue-900/30 p-1 transition-colors duration-300">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `flex-1 min-w-0 whitespace-nowrap truncate rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                  ${
                    selected
                      ? "bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 shadow"
                      : "text-blue-600 dark:text-blue-400 hover:bg-white/[0.12] dark:hover:bg-gray-800/50 hover:text-blue-700 dark:hover:text-blue-300"
                  }`
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {tabs.map((tab, index) => (
              <Tab.Panel key={index}>
                {tab.feedback && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-300">
                    <FeedbackForm
                      feedback={tab.feedback}
                      hackathon={hackathon}
                      user={user}
                      router={router}
                    />
                  </div>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
