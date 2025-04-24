// src/app/[locale]/forum/thread/[id]/_components/UserInfo.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "@/types/entities/user";
import { userService } from "@/services/user.service";

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

    const roleColors: Record<UserRole, { bg: string; text: string }> = {
      TEAM_MEMBER: { bg: "bg-blue-100", text: "text-blue-800" },
      JUDGE: { bg: "bg-purple-100", text: "text-purple-800" },
      MENTOR: { bg: "bg-green-100", text: "text-green-800" },
      ADMIN: { bg: "bg-red-100", text: "text-red-800" },
      ORGANIZER: { bg: "bg-yellow-100", text: "text-yellow-800" },
    };

    const { bg, text } = roleColors[role] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${bg} ${text}`}>
        {role.replace("_", " ")}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
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
          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-indigo-800">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">{username}</span>
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
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-indigo-800">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-800">{username}</span>
          {user?.userRoles &&
            user.userRoles.length > 0 &&
            getUserRoleBadge(user.userRoles[0].role.name as UserRole)}
        </div>
        {createdAt && (
          <p className="text-xs text-gray-500">{formatDate(createdAt)}</p>
        )}
      </div>
    </div>
  );
}
