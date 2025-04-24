// src/app/[locale]/providers.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const importedMessages = (await import(`../../messages/${locale}.json`))
          .default;
        setMessages(importedMessages);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, [locale]);

  // Don't render until messages are loaded
  if (!messages) {
    return null; // Or a loading indicator
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </NextThemesProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}
