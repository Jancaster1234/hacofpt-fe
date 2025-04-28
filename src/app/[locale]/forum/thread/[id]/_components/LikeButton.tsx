// src/app/[locale]/forum/thread/[id]/_components/LikeButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { threadPostLikeService } from "@/services/threadPostLike.service";
import { ThreadPostLike } from "@/types/entities/threadPostLike";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface LikeButtonProps {
  threadPostId: string;
  initialLikes?: ThreadPostLike[];
  likes?: ThreadPostLike[];
  isLoading?: boolean;
  currentUsername?: string;
  onLikeAdded?: () => void;
  onLikeRemoved?: () => void;
}

export default function LikeButton({
  threadPostId,
  initialLikes = [],
  likes: externalLikes,
  isLoading: externalLoading,
  currentUsername,
  onLikeAdded,
  onLikeRemoved,
}: LikeButtonProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState<ThreadPostLike[]>(
    initialLikes || externalLikes || []
  );
  const [loading, setLoading] = useState(externalLoading || false);
  const [userLike, setUserLike] = useState<ThreadPostLike | null>(null);
  const toast = useToast();
  const t = useTranslations("forum");

  useEffect(() => {
    if (externalLikes) {
      setLikes(externalLikes);
    }
  }, [externalLikes]);

  useEffect(() => {
    const fetchLikes = async () => {
      // Skip fetching if we already have likes from props
      if (initialLikes.length > 0 || externalLikes) {
        // Find user's like in the current likes array
        const currentUserName = currentUsername || user?.username;
        if (currentUserName) {
          const existingLike = likes.find(
            (like) => like.createdByUserName === currentUserName
          );
          setUserLike(existingLike || null);
        }
        return;
      }

      try {
        setLoading(true);
        const response =
          await threadPostLikeService.getLikesByThreadPostId(threadPostId);
        setLikes(response.data);

        // Check if current user has liked this post
        const currentUserName = currentUsername || user?.username;
        if (currentUserName) {
          const currentUserLike = response.data.find(
            (like) => like.createdByUserName === currentUserName
          );
          setUserLike(currentUserLike || null);
        }
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [threadPostId, user, currentUsername, initialLikes, externalLikes]);

  const handleLikeToggle = async () => {
    if (!user && !currentUsername) return;

    setLoading(true);
    try {
      if (userLike) {
        // Unlike: remove the like
        const response = await threadPostLikeService.deleteThreadPostLike(
          userLike.id
        );
        setLikes((prev) => prev.filter((like) => like.id !== userLike.id));
        setUserLike(null);
        if (onLikeRemoved) onLikeRemoved();
        toast.success(response.message || t("likeRemoved"));
      } else {
        // Like: add a new like
        const response = await threadPostLikeService.createThreadPostLike({
          threadPostId,
        });

        if (response.data) {
          setLikes((prev) => [...prev, response.data]);
          setUserLike(response.data);
          if (onLikeAdded) onLikeAdded();
          toast.success(response.message || t("likeAdded"));
        }
      }
    } catch (error: any) {
      toast.error(error.message || t("likeFailed"));
      console.error("Failed to toggle like:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeUsername = currentUsername || user?.username;

  return (
    <button
      onClick={handleLikeToggle}
      disabled={loading || !activeUsername}
      className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200 
      ${
        userLike
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
      } 
      ${!activeUsername ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      sm:text-sm text-xs`}
      title={activeUsername ? t("likePost") : t("signInToLike")}
      aria-label={userLike ? t("unlikePost") : t("likePost")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={userLike ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sm:w-4 sm:h-4 w-3 h-3"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
      </svg>
      <span>{likes.length}</span>
      {loading && (
        <LoadingSpinner size="sm" showText={false} className="ml-1" />
      )}
    </button>
  );
}
