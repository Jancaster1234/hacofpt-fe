// src/app/[locale]/hackathon/[id]/feedback/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { feedbackService } from "@/services/feedback.service";
import { feedbackDetailService } from "@/services/feedbackDetail.service";
import { Feedback } from "@/types/entities/feedback";
import { FeedbackDetail } from "@/types/entities/feedbackDetail";

type FeedbackCategory = {
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    placeholder?: string;
  }[];
};

export default function HackathonFeedback() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const hackathonId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(
    null
  );
  const [existingFeedbackDetails, setExistingFeedbackDetails] = useState<
    FeedbackDetail[]
  >([]);

  const feedbackCategories: FeedbackCategory[] = [
    {
      title: "Hackathon Experience",
      description: "Please rate your overall experience with the hackathon",
      questions: [
        {
          id: "hackathon_organization",
          question: "How well was the hackathon organized?",
          placeholder: "Any specific comments about the organization?",
        },
        {
          id: "hackathon_timeline",
          question: "Was the timeline appropriate for the challenge?",
          placeholder: "Share your thoughts on the timeline",
        },
        {
          id: "hackathon_resources",
          question: "Were sufficient resources provided for the hackathon?",
          placeholder: "What resources were helpful or missing?",
        },
      ],
    },
    {
      title: "Mentor Support",
      description: "Please rate the support provided by your mentor",
      questions: [
        {
          id: "mentor_availability",
          question: "Was your mentor available when needed?",
          placeholder: "Comments about mentor availability",
        },
        {
          id: "mentor_knowledge",
          question: "How would you rate your mentor's technical knowledge?",
          placeholder: "Comments about mentor's expertise",
        },
        {
          id: "mentor_guidance",
          question: "How helpful was the guidance provided by your mentor?",
          placeholder: "How did your mentor help your team?",
        },
      ],
    },
    {
      title: "Platform Experience",
      description: "Please rate your experience with the hackathon platform",
      questions: [
        {
          id: "platform_usability",
          question: "How user-friendly was the platform?",
          placeholder: "Comments about the platform's usability",
        },
        {
          id: "platform_features",
          question: "Did the platform have all the features you needed?",
          placeholder: "Any features missing or particularly helpful?",
        },
        {
          id: "platform_reliability",
          question: "How reliable was the platform during the hackathon?",
          placeholder: "Did you experience any issues?",
        },
      ],
    },
  ];

  // Fetch existing feedback if available
  useEffect(() => {
    const fetchUserFeedback = async () => {
      if (!user || !user.email || !hackathonId) {
        setLoading(false);
        return;
      }

      try {
        // Get username from email (assuming email is used as username)
        const username = user.email.split("@")[0];

        // Get feedbacks by username and hackathon ID
        const { data: userFeedbacks } =
          await feedbackService.getFeedbacksByCreatedByUserName(username);

        // Filter feedbacks by hackathon ID
        const hackathonFeedbacks = userFeedbacks.filter(
          (feedback) => feedback.hackathonId === hackathonId
        );

        // Sort by creation date to get the latest feedback
        const sortedFeedbacks = hackathonFeedbacks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (sortedFeedbacks.length > 0) {
          const latestFeedback = sortedFeedbacks[0];
          setExistingFeedback(latestFeedback);

          // Fetch feedback details for this feedback
          const { data: feedbackDetails } =
            await feedbackDetailService.getFeedbackDetailsByFeedbackId(
              latestFeedback.id
            );

          setExistingFeedbackDetails(feedbackDetails);

          // Populate the form with existing feedback
          const feedbackRatings: Record<string, number> = {};
          const feedbackNotes: Record<string, string> = {};

          feedbackDetails.forEach((detail) => {
            feedbackRatings[detail.content] = detail.rate;
            feedbackNotes[detail.content] = detail.note || "";
          });

          setFeedback(feedbackRatings);
          setNotes(feedbackNotes);
        }
      } catch (error) {
        console.error("Error fetching user feedback:", error);
        toast.error(
          "Failed to load your previous feedback. Starting with a new form."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserFeedback();
  }, [user, hackathonId]);

  const handleRatingChange = (questionId: string, rating: number) => {
    setFeedback({
      ...feedback,
      [questionId]: rating,
    });
  };

  const handleNoteChange = (questionId: string, note: string) => {
    setNotes({
      ...notes,
      [questionId]: note,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!user) {
      toast.error("You must be logged in to submit feedback");
      setSubmitting(false);
      return;
    }

    try {
      // Prepare the feedback details
      const feedbackDetails = Object.keys(feedback).map((questionId) => ({
        content: questionId,
        maxRating: 5,
        rate: feedback[questionId],
        note: notes[questionId] || "",
      }));

      if (existingFeedback) {
        // Update existing feedback details in bulk
        const { data, message } =
          await feedbackDetailService.bulkCreateFeedbackDetails(
            existingFeedback.id,
            feedbackDetails
          );

        toast.success(message || "Feedback updated successfully!");
      } else {
        // Create new feedback
        const feedbackData = {
          hackathonId,
          //teamId: user.teamId || "individual",
          // If you have mentorId available, add it here
          // mentorId: "your-mentor-id"
        };

        const { data: createdFeedback, message } =
          await feedbackService.createFeedback(feedbackData);

        if (createdFeedback && createdFeedback.id) {
          // Create feedback details in bulk
          await feedbackDetailService.bulkCreateFeedbackDetails(
            createdFeedback.id,
            feedbackDetails
          );

          toast.success("Feedback submitted successfully!");
          setExistingFeedback(createdFeedback);
        } else {
          throw new Error("Failed to create feedback");
        }
      }

      // Redirect to dashboard or another appropriate page
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error(
        error.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Star rating component
  const StarRating = ({
    questionId,
    rating,
  }: {
    questionId: string;
    rating: number;
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(questionId, star)}
            className={`text-2xl focus:outline-none ${
              star <= (feedback[questionId] || 0)
                ? "text-yellow-500"
                : "text-gray-300"
            }`}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-700">Loading your feedback...</p>
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
            !{" "}
            {existingFeedback
              ? "You can update your previous feedback below."
              : "We appreciate your feedback."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {feedbackCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {category.title}
              </h2>
              <p className="text-gray-600">{category.description}</p>

              <div className="mt-6 space-y-6">
                {category.questions.map((q) => (
                  <div key={q.id} className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        {q.question}
                      </label>
                      <StarRating
                        questionId={q.id}
                        rating={feedback[q.id] || 0}
                      />
                    </div>
                    <textarea
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      rows={2}
                      placeholder={q.placeholder}
                      value={notes[q.id] || ""}
                      onChange={(e) => handleNoteChange(q.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-6 py-3 text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {submitting
                ? "Submitting..."
                : existingFeedback
                  ? "Update Feedback"
                  : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
