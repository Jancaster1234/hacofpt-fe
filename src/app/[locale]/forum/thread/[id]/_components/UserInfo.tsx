// src/app/[locale]/forum/thread/[id]/_components/UserInfo.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "@/types/entities/user";
import { userService } from "@/services/user.service";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type UserRole = "TEAM_MEMBER" | "JUDGE" | "MENTOR" | "ADMIN" | "ORGANIZER";

interface UserInfoProps {
  username: string;
  createdAt?: string;
  className?: string;
  compact?: boolean;
}

export default function UserInfo({
  username,
  createdAt,
  className = "",
  compact = false,
}: UserInfoProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("forum");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await userService.getUserByUsername(username);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  const getUserRoleBadge = (role: UserRole | undefined) => {
    if (!role) return null;

    const roleColors: Record<
      UserRole,
      { bg: string; text: string; darkBg: string; darkText: string }
    > = {
      TEAM_MEMBER: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        darkBg: "dark:bg-blue-800",
        darkText: "dark:text-blue-100",
      },
      JUDGE: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        darkBg: "dark:bg-purple-800",
        darkText: "dark:text-purple-100",
      },
      MENTOR: {
        bg: "bg-green-100",
        text: "text-green-800",
        darkBg: "dark:bg-green-800",
        darkText: "dark:text-green-100",
      },
      ADMIN: {
        bg: "bg-red-100",
        text: "text-red-800",
        darkBg: "dark:bg-red-800",
        darkText: "dark:text-red-100",
      },
      ORGANIZER: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        darkBg: "dark:bg-yellow-800",
        darkText: "dark:text-yellow-100",
      },
    };

    const colors = roleColors[role] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      darkBg: "dark:bg-gray-700",
      darkText: "dark:text-gray-200",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText} transition-colors duration-300`}
      >
        {t(`roles.${role.toLowerCase()}`)}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      t("common.at") +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse transition-colors"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse transition-colors"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={username}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center transition-colors">
            <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-200 transition-colors">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
          {username}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {user?.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={username}
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center transition-colors">
          <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 transition-colors">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors">
            {username}
          </span>
          {user?.userRoles &&
            user.userRoles.length > 0 &&
            getUserRoleBadge(user.userRoles[0].role.name as UserRole)}
        </div>
        {createdAt && (
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
            {formatDate(createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}
