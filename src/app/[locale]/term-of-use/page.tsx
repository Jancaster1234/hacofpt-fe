// src/app/[locale]/term-of-use/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfUse() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
        <LoadingSpinner size="lg" showText={true} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-10 transition-all duration-300">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors">
            Terms of Use
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Last Updated: May 10, 2025
          </p>
        </div>

        <div className="space-y-8 text-gray-700 dark:text-gray-300">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the HaCoF (Hackathon Competition for FPT
              University) platform, you agree to be bound by these Terms of Use.
              If you do not agree to all the terms and conditions of this
              agreement, you may not access or use the platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              2. Eligibility
            </h2>
            <p>
              To use the HaCoF platform, you must meet the following eligibility
              requirements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Be a current student at FPT University or an authorized
                participant invited by the platform administrators.
              </li>
              <li>
                Have a valid account with accurate, complete, and up-to-date
                information.
              </li>
              <li>
                Provide truthful information about your identity,
                qualifications, and skills.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              3. User Accounts
            </h2>
            <p>
              When creating an account on HaCoF, you agree to the following:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You are responsible for all activities that occur under your
                account.
              </li>
              <li>
                You must maintain the security and confidentiality of your login
                credentials.
              </li>
              <li>
                You will promptly notify the platform administrators of any
                unauthorized use of your account.
              </li>
              <li>
                The platform administrators reserve the right to suspend or
                terminate your account if you violate these Terms of Use.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              4. Hackathon Rules
            </h2>
            <p>
              When participating in hackathons through the HaCoF platform, you
              agree to abide by the following rules:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Follow all specific guidelines provided for each hackathon
                event.
              </li>
              <li>
                Adhere to the specified team size limitations for each event.
              </li>
              <li>
                Submit all required materials before the stated deadlines.
              </li>
              <li>Accept the decisions of judges as final.</li>
              <li>
                Understand that violation of rules may result in
                disqualification from the event.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              5. Intellectual Property
            </h2>
            <p>
              With regard to intellectual property rights on the HaCoF platform:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You retain ownership of the original content you create during
                hackathons.
              </li>
              <li>
                You grant FPT University a non-exclusive, royalty-free license
                to use, display, and promote your hackathon projects for
                educational and promotional purposes.
              </li>
              <li>
                You are responsible for ensuring that your submissions do not
                infringe upon third-party intellectual property rights.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              6. Code of Conduct
            </h2>
            <p>While using the HaCoF platform, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Engage in harassment, discrimination, or bullying of any kind.
              </li>
              <li>
                Disrupt the functioning of the platform or interfere with other
                users' experiences.
              </li>
              <li>
                Use the platform for any illegal purpose or to promote illegal
                activities.
              </li>
              <li>
                Misrepresent your identity, qualifications, or affiliations.
              </li>
              <li>
                Send spam or engage in excessive messaging or notifications to
                other users.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              7. Platform Usage
            </h2>
            <p>When using the HaCoF platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You agree to use the platform only for its intended purpose of
                participating in and organizing hackathon events.
              </li>
              <li>
                You will not attempt to access restricted areas of the platform
                or bypass security measures.
              </li>
              <li>
                You acknowledge that your activities may be logged and monitored
                for security and improvement purposes.
              </li>
              <li>
                You understand that user activity logging is implemented to
                monitor actions within the system.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              8. Limitation of Liability
            </h2>
            <p>
              The HaCoF platform, FPT University, and its administrators shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use the platform. The platform is provided on an "as
              is" and "as available" basis without warranties of any kind.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              9. Changes to Terms
            </h2>
            <p>
              The platform administrators reserve the right to modify these
              Terms of Use at any time. Continued use of the platform after
              changes constitutes acceptance of the modified terms. Users will
              be notified of significant changes through the platform or via
              email.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              10. Termination
            </h2>
            <p>
              The platform administrators may terminate or suspend your access
              to the HaCoF platform immediately, without prior notice or
              liability, for any reason, including breach of these Terms of Use.
              Upon termination, your right to use the platform will cease
              immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              11. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Use, please contact
              the platform administrators through the support channels available
              on the HaCoF platform or email support@hacof.fpt.edu.vn.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
