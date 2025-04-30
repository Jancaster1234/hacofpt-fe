/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to send reset password email");
            }

            toast.success("Reset password email sent successfully! Please check your email for the OTP code.");
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error) {
            toast.error("Failed to send reset password email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                        Forgot your password?
                    </h3>
                    <p className="mb-11 text-center text-base font-medium text-body-color">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <Label htmlFor="email" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-md border border-transparent py-4 px-8 text-lg text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full rounded-sm bg-[#4A6CF7] px-12 py-6 text-lg font-medium text-white hover:bg-[#4A6CF7]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending..." : "Send OTP"}
                        </Button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/signin"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
} 