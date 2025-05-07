// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/KanbanBoardWithAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { Board } from "@/types/entities/board";
import { Team } from "@/types/entities/team";
import { useAuth } from "@/hooks/useAuth_v0";
import { boardUserService } from "@/services/boardUser.service";
import KanbanBoard from "./KanbanBoard";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface KanbanBoardWithAuthProps {
  board: Board | null;
  team: Team | null;
  isLoading: boolean;
}

export default function KanbanBoardWithAuth({
  board,
  team,
  isLoading,
}: KanbanBoardWithAuthProps) {
  const { user } = useAuth();
  const t = useTranslations("kanban");
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    async function checkUserAccess() {
      if (!board || !user) {
        setHasAccess(false);
        setCheckingAccess(false);
        return;
      }

      try {
        // Get all board users including those with isDeleted status
        const { data: boardUsers } =
          await boardUserService.getBoardUsersByBoardId(board.id);

        // Check if current user is in the non-deleted board users list
        const userHasAccess = boardUsers.some(
          (boardUser) => boardUser.user?.id === user.id && !boardUser.isDeleted
        );

        setHasAccess(userHasAccess);
      } catch (error) {
        console.error("Error checking board access:", error);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    }

    checkUserAccess();
  }, [board, user]);

  // Show loading state while checking access
  if (checkingAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {t("checkingAccess")}
        </p>
      </div>
    );
  }

  // Show access denied message
  if (!hasAccess) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
          {t("accessDenied")}
        </h2>
        <p className="text-red-600 dark:text-red-300">{t("noAccessToBoard")}</p>
      </div>
    );
  }

  // If user has access, render the actual KanbanBoard
  return <KanbanBoard board={board} team={team} isLoading={isLoading} />;
}
