// src/app/[locale]/hackathon/[id]/feedback/_components/FeedbackForm.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { feedbackDetailService } from "@/services/feedbackDetail.service";
import { Feedback } from "@/types/entities/feedback";
import { FeedbackDetail } from "@/types/entities/feedbackDetail";
import { User } from "@/types/entities/user";
import { Hackathon } from "@/types/entities/hackathon";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

type StarRatingProps = {
  questionId: string;
  rating: number;
  onChange: (questionId: string, rating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({
  questionId,
  rating,
  onChange,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(questionId, star)}
          className={`text-2xl focus:outline-none ${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

type FeedbackFormProps = {
  feedback: Feedback;
  hackathon: Hackathon;
  user: User | null;
  router: AppRouterInstance;
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  feedback,
  hackathon,
  user,
  router,
}) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [feedbackDetails, setFeedbackDetails] = useState<FeedbackDetail[]>([]);
  const [userFeedbackDetails, setUserFeedbackDetails] = useState<
    FeedbackDetail[]
  >([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Fetch feedback details (questions) and user's previous responses
  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      if (!feedback?.id || !user?.username) {
        setLoading(false);
        return;
      }

      try {
        // Get feedback details (questions)
        const { data: details } =
          await feedbackDetailService.getFeedbackDetailsByFeedbackIdAndCreator(
            feedback.id,
            hackathon.createdByUserName
          );
        setFeedbackDetails(details);

        // Check if user has previously submitted responses
        try {
          const { data: userDetails } =
            await feedbackDetailService.getFeedbackDetailsByFeedbackIdAndCreator(
              feedback.id,
              user.username
            );

          if (userDetails && userDetails.length > 0) {
            setUserFeedbackDetails(userDetails);
            setHasSubmitted(true);

            // Populate form with previous responses
            const savedRatings: Record<string, number> = {};
            const savedNotes: Record<string, string> = {};

            userDetails.forEach((detail) => {
              if (detail.content && detail.rate) {
                savedRatings[detail.content] = detail.rate;
                if (detail.note) {
                  savedNotes[detail.content] = detail.note;
                }
              }
            });

            setRatings(savedRatings);
            setNotes(savedNotes);
          }
        } catch (error) {
          console.log("No previous submissions found for this user");
        }
      } catch (error) {
        console.error("Error fetching feedback details:", error);
        toast.error(
          "Failed to load feedback questions. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackDetails();
  }, [feedback, user]);

  const handleRatingChange = (questionId: string, rating: number) => {
    setRatings({
      ...ratings,
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

    if (!user || !feedback.id) {
      toast.error("You must be logged in to submit feedback");
      setSubmitting(false);
      return;
    }

    try {
      // Prepare feedback detail submissions
      const feedbackDetailsList = feedbackDetails.map((detail) => ({
        content: detail.content,
        maxRating: detail.maxRating || 5,
        rate: ratings[detail.content] || 0,
        note: notes[detail.content] || "",
      }));

      // Submit feedback details
      const { message } = await feedbackDetailService.bulkCreateFeedbackDetails(
        feedback.id,
        feedbackDetailsList
      );

      toast.success(
        hasSubmitted
          ? "Feedback updated successfully!"
          : "Feedback submitted successfully!"
      );

      // Update submission status
      setHasSubmitted(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error(
        error.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Group feedback details by category (if available)
  const groupedDetails: Record<string, FeedbackDetail[]> = {};

  feedbackDetails.forEach((detail) => {
    // Extract category from content (e.g., "category:question_id")
    const contentParts = detail.content.split(":");
    const category = contentParts.length > 1 ? contentParts[0] : "General";

    if (!groupedDetails[category]) {
      groupedDetails[category] = [];
    }

    groupedDetails[category].push(detail);
  });

  // If there are no categories, use a default grouping
  const categories =
    Object.keys(groupedDetails).length > 0
      ? Object.keys(groupedDetails)
      : ["Feedback Questions"];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-700">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {categories.map((category) => (
        <div
          key={category}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {category === "General" ? "Feedback Questions" : category}
          </h2>

          <div className="mt-6 space-y-6">
            {(groupedDetails[category] || feedbackDetails).map((detail) => {
              // Extract question text (remove category prefix if present)
              const contentParts = detail.content.split(":");
              const questionText =
                contentParts.length > 1 ? contentParts[1] : detail.content;

              return (
                <div key={detail.content} className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {questionText}
                    </label>
                    <StarRating
                      questionId={detail.content}
                      rating={ratings[detail.content] || 0}
                      onChange={handleRatingChange}
                    />
                  </div>
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    rows={2}
                    placeholder="Add your comments here"
                    value={notes[detail.content] || ""}
                    onChange={(e) =>
                      handleNoteChange(detail.content, e.target.value)
                    }
                  />
                </div>
              );
            })}
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
            : hasSubmitted
              ? "Update Feedback"
              : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
