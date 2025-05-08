// src/app/[locale]/hackathon/[id]/feedback/_components/FeedbackForm.tsx
import React, { useState, useEffect } from "react";
import { feedbackDetailService } from "@/services/feedbackDetail.service";
import { Feedback } from "@/types/entities/feedback";
import { FeedbackDetail } from "@/types/entities/feedbackDetail";
import { User } from "@/types/entities/user";
import { Hackathon } from "@/types/entities/hackathon";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const t = useTranslations("feedback");

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(questionId, star)}
          className={`text-xl sm:text-2xl focus:outline-none transition-colors duration-200 ${
            star <= rating
              ? "text-yellow-500 dark:text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
          aria-label={`${star} ${t(star === 1 ? "star" : "stars")}`}
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
  const t = useTranslations("feedback");
  const toast = useToast();

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
        toast.error(t("failedToLoadQuestions"));
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackDetails();
  }, [feedback, user, hackathon.createdByUserName]); // Intentionally omitting toast from dependencies

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
      toast.error(t("loginRequired"));
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
          ? t("feedbackUpdatedSuccess")
          : t("feedbackSubmittedSuccess")
      );

      // Update submission status
      setHasSubmitted(true);
      setSubmitting(false);

      // Router push to dashboard removed
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error(error.message || t("failedToSubmitFeedback"));
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
      : [t("feedbackQuestions")];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="md" showText={true} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
      {categories.map((category) => (
        <div
          key={category}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:p-6 shadow-sm transition-colors duration-200"
        >
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
            {category === "General" ? t("feedbackQuestions") : category}
          </h2>

          <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
            {(groupedDetails[category] || feedbackDetails).map((detail) => {
              // Extract question text (remove category prefix if present)
              const contentParts = detail.content.split(":");
              const questionText =
                contentParts.length > 1 ? contentParts[1] : detail.content;

              return (
                <div key={detail.content} className="space-y-2 md:space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {questionText}
                    </label>
                    <StarRating
                      questionId={detail.content}
                      rating={ratings[detail.content] || 0}
                      onChange={handleRatingChange}
                    />
                  </div>
                  <textarea
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 md:px-4 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                    rows={2}
                    placeholder={t("addCommentsPlaceholder")}
                    value={notes[detail.content] || ""}
                    onChange={(e) =>
                      handleNoteChange(detail.content, e.target.value)
                    }
                    aria-label={t("comments")}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-6 md:mt-8 flex justify-center">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 dark:bg-blue-700 px-4 sm:px-6 py-2 sm:py-3 text-white shadow-sm transition-all duration-200 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
          aria-busy={submitting}
        >
          {submitting
            ? t("submitting")
            : hasSubmitted
              ? t("updateFeedback")
              : t("submitFeedback")}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
