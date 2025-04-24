// src/app/[locale]/chat/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Page",
  description: "This is the chat page where users can communicate.",
};

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-900">
        This is the Chat Page
      </h1>
      <p className="mt-2 text-gray-600">Welcome to the chat section.</p>
    </div>
  );
}
