// src/app/[locale]/hackathon/[id]/feedback/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
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

export default function HackathonFeedback() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const hackathonId = params.id as string;

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
        const { data: hackathonData } =
          await hackathonService.getHackathonById(hackathonId);
        setHackathon(hackathonData);

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
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load feedback data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, hackathonId]);

  if (loading) {
    return <LoadingSpinner showText={true} />;
  }

  // Prepare tabs data
  const tabs = [
    { name: "Hackathon Feedback", feedback: hackathonFeedback },
    ...mentors.map((mentor, index) => ({
      name: `${mentor.firstName} ${mentor.lastName} (Mentor)`,
      feedback: mentorFeedbacks[mentor.id],
    })),
  ].filter((tab) => tab.feedback); // Only show tabs with available feedback

  if (tabs.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <div className="mx-auto w-full max-w-3xl px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Hackathon Feedback
          </h1>
          <p className="mt-4 text-gray-600">
            No feedback forms are available for this hackathon yet. Please check
            back later.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-md bg-blue-600 px-6 py-3 text-white shadow-sm transition hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Hackathon Feedback
          </h1>
          <p className="mt-2 text-gray-600">
            Hello, {user ? `${user.firstName} ${user.lastName}` : "Participant"}
            ! Please provide your feedback on the hackathon experience.
          </p>
        </div>

        <Tab.Group onChange={setActiveTabIndex}>
          <Tab.List className="flex rounded-xl bg-blue-50 p-1">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${
                    selected
                      ? "bg-white text-blue-700 shadow"
                      : "text-blue-600 hover:bg-white/[0.12] hover:text-blue-700"
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
                  <FeedbackForm
                    feedback={tab.feedback}
                    hackathonId={hackathonId}
                    user={user}
                    router={router}
                  />
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
