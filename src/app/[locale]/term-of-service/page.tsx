"use client";

import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 transition-colors">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">
            Terms of Service
          </h1>

          <div className="text-gray-700 dark:text-gray-300 space-y-6 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 italic">
              Last Updated: May 1, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Introduction
              </h2>
              <p>
                Welcome to our platform. These Terms of Service govern your
                access to and use of our website, applications, and services. By
                accessing or using our platform, you agree to be bound by these
                terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Definitions
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Platform</span>: Our website,
                  mobile applications, and all related services and tools.
                </li>
                <li>
                  <span className="font-medium">Services</span>: All features,
                  functionalities, and offerings available through our platform.
                </li>
                <li>
                  <span className="font-medium">User</span>: Any individual or
                  entity that accesses or uses our platform.
                </li>
                <li>
                  <span className="font-medium">Content</span>: All text,
                  graphics, images, music, software, audio, video, information,
                  or other materials that appear on our platform.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Acceptance of Terms
              </h2>
              <p>
                By accessing or using our platform, you acknowledge that you
                have read, understood, and agree to be bound by these Terms of
                Service. If you do not agree to these terms, please do not use
                our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                User Accounts
              </h2>
              <p className="mb-4">
                To access certain features of our platform, you may need to
                create an account. When creating an account, you agree to:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Provide accurate, current, and complete information about
                  yourself.
                </li>
                <li>Maintain and promptly update your account information.</li>
                <li>Keep your password secure and confidential.</li>
                <li>
                  Be responsible for all activities that occur under your
                  account.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                User Roles
              </h2>
              <p className="mb-4">
                Our platform supports different user roles, each with specific
                permissions and responsibilities:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <span className="font-medium">Standard User</span>: Can access
                  basic platform features and create content subject to these
                  terms.
                </li>
                <li>
                  <span className="font-medium">Premium User</span>: Has access
                  to additional features and priority support based on
                  subscription status.
                </li>
                <li>
                  <span className="font-medium">Content Creator</span>: Can
                  publish specialized content subject to our content guidelines.
                </li>
                <li>
                  <span className="font-medium">Community Moderator</span>:
                  Authorized to review content and enforce community standards.
                </li>
                <li>
                  <span className="font-medium">Business Account</span>:
                  Organizations using our platform for commercial purposes with
                  additional rights and responsibilities.
                </li>
                <li>
                  <span className="font-medium">Administrator</span>: Platform
                  staff with elevated permissions to manage the platform and
                  enforce these terms.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                User Conduct
              </h2>
              <p className="mb-4">
                You agree to use our platform in compliance with all applicable
                laws and these Terms of Service. Our community thrives on
                respect and collaboration.
              </p>
              <p className="mb-2 font-medium">Prohibited Activities:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>
                  Violating any laws, third-party rights, or our policies.
                </li>
                <li>
                  Posting illegal, harmful, threatening, abusive, or defamatory
                  content.
                </li>
                <li>
                  Impersonating others or misrepresenting your affiliation with
                  any person or entity.
                </li>
                <li>
                  Attempting to gain unauthorized access to other user accounts
                  or system areas.
                </li>
                <li>
                  Using the platform to distribute malware or conduct phishing
                  activities.
                </li>
                <li>
                  Engaging in any activity that disrupts or interferes with the
                  platform's functioning.
                </li>
              </ul>
              <p>
                Violations of these conduct guidelines may result in content
                removal, account suspension, or termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Intellectual Property Rights
              </h2>
              <p className="mb-4">
                We respect intellectual property rights and expect our users to
                do the same.
              </p>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2 transition-colors">
                Platform Content
              </h3>
              <p className="mb-4">
                The platform and its original content, features, and
                functionality are owned by us and are protected by international
                copyright, trademark, and other intellectual property laws.
              </p>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2 transition-colors">
                User Submissions
              </h3>
              <p>
                By submitting content to our platform, you grant us a worldwide,
                non-exclusive, royalty-free license to use, reproduce, modify,
                adapt, publish, translate, and distribute your content in any
                existing or future media formats.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Content Policy
              </h2>
              <p>
                All content must comply with our community guidelines and
                applicable laws. We reserve the right to remove any content that
                violates these terms or that we find objectionable for any
                reason, without prior notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Account Termination
              </h2>
              <p>
                We may suspend or terminate your account and access to our
                platform at our sole discretion, without notice, for conduct
                that we believe violates these Terms of Service or is harmful to
                other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Disclaimers
              </h2>
              <p className="uppercase text-sm font-semibold mb-2">
                DISCLAIMER OF WARRANTIES
              </p>
              <p className="mb-4">
                OUR PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT
                WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, TIMELY, SECURE,
                OR ERROR-FREE.
              </p>
              <p className="uppercase text-sm font-semibold mb-2">
                LIMITATION OF LIABILITY
              </p>
              <p>
                IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT
                LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
                INTANGIBLE LOSSES.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold us harmless from and
                against any claims, liabilities, damages, losses, and expenses,
                including reasonable attorneys' fees and costs, arising out of
                or in any way connected with your access to or use of our
                platform or your violation of these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms of Service at any
                time. We will provide notice of significant changes by posting
                the updated terms on our platform. Your continued use of the
                platform after such modifications constitutes your acceptance of
                the revised terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Governing Law
              </h2>
              <p>
                These Terms of Service shall be governed by and construed in
                accordance with the laws of the United States, without regard to
                its conflict of law provisions. Any disputes arising under these
                terms shall be subject to the exclusive jurisdiction of the
                courts in the United States.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us using the information below:
              </p>
              <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg transition-colors">
                <p className="font-medium">legal@ourcompany.com</p>
                <p>123 Legal Avenue, Suite 500, San Francisco, CA 94103, USA</p>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center transition-colors">
              <p className="text-gray-500 dark:text-gray-400">
                Related documents:
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms-of-use"
                  className="text-blue-600 hover:underline"
                >
                  Terms of Use
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
