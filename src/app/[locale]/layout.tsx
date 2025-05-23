// src/app/[locale]/layout.tsx
"use client";

import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "../../styles/index.css";
import { useAuth } from "@/hooks/useAuth_v0";
import { useEffect } from "react";
import { ToastProvider } from "@/components/ui/toast-provider";
import { Providers } from "./providers";
import { TestToastProvider } from "@/components/ui/test-toast-provider";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = React.use(params);
  const { locale } = unwrappedParams;

  const { checkUser } = useAuth();

  useEffect(() => {
    console.log("🔹 AuthProvider: Initializing auth check");

    // Check if this is a locale change
    const isLocaleChange = sessionStorage.getItem("localeChange") === "true";

    if (isLocaleChange) {
      // Clear the flag
      sessionStorage.removeItem("localeChange");
      console.log("🔹 Skipping auth check during locale change");
    } else {
      // Normal behavior - check user authentication
      checkUser();
    }
  }, [locale]);

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
        className={`pt-[142px] bg-[#FCFCFC] dark:bg-black ${inter.className}`}
      >
        <WebSocketProvider>
          <Providers locale={locale}>
            <Header />
            {children}
            <Footer />
            <ToastProvider />
            {/* <TestToastProvider /> */}
            <ScrollToTop />
          </Providers>
        </WebSocketProvider>
      </body>
    </html>
  );
}
