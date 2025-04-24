// src/app/[locale]/forum/category/[id]/_components/ThreadActions.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ForumThread } from "@/types/entities/forumThread";

interface ThreadActionsProps {
  thread: ForumThread;
  isAdmin: boolean;
  onDelete: () => void;
  onUpdate: (updates: { isPinned?: boolean; isLocked?: boolean }) => void;
}

export default function ThreadActions({
  thread,
  isAdmin,
  onDelete,
  onUpdate,
}: ThreadActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle clicks outside the menu to close it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    // Add event listener only when menu is open
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener when component unmounts or menu closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this thread? This action cannot be undone."
      )
    ) {
      onDelete();
    }
    setIsMenuOpen(false);
  };

  const handlePin = () => {
    onUpdate({ isPinned: !thread.isPinned });
    setIsMenuOpen(false);
  };

  const handleLock = () => {
    onUpdate({ isLocked: !thread.isLocked });
    setIsMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
        onClick={handleMenuToggle}
        aria-label="Thread actions"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
          {isAdmin && (
            <>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handlePin}
              >
                {thread.isPinned ? "Unpin Thread" : "Pin Thread"}
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleLock}
              >
                {thread.isLocked ? "Unlock Thread" : "Lock Thread"}
              </button>
              <div className="border-t border-gray-100 my-1"></div>
            </>
          )}
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={handleDelete}
          >
            Delete Thread
          </button>
        </div>
      )}
    </div>
  );
}
