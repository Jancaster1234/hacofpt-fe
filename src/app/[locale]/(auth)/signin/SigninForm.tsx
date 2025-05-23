// src/app/[locale]/(auth)/signin/SigninForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth_v0";
import SocialLoginButtons from "./SocialLoginButtons";
import { useToast } from "@/hooks/use-toast";

const SigninForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const { login } = useAuth(); // Use the latest authentication hook
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const toast = useToast();

  const validateForm = () => {
    const errors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = "Username cannot be blank";
    }

    if (!password.trim()) {
      errors.password = "Password cannot be blank";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await login(username, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError(null);

      const authUrl = `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?redirect_uri=${encodeURIComponent(
        process.env.NEXT_PUBLIC_REDIRECT_URI || ""
      )}&response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}&scope=openid%20email%20profile&service=lso&o2v=1&ddm=1&flowName=GeneralOAuthFlow`;
      window.location.href = authUrl;
    } catch (error) {
      console.error("Google sign in error:", error);
      setGoogleError("Failed to sign in with Google. Please try again.");
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
        Sign in to your account
      </h3>
      <p className="mb-11 text-center text-base font-medium text-body-color">
        Login to your account for a faster checkout.
      </p>

      {/* Login Form */}
      <form onSubmit={handleLogin}>
        <div className="mb-8">
          <label
            htmlFor="username"
            className="mb-3 block text-sm font-medium text-dark dark:text-white"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full rounded-md border ${
              validationErrors.username
                ? "border-red-500"
                : "border-transparent"
            } py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp`}
          />
          {validationErrors.username && (
            <p className="mt-2 text-sm text-red-600">
              {validationErrors.username}
            </p>
          )}
        </div>

        <div className="mb-8">
          <label
            htmlFor="password"
            className="mb-3 block text-sm font-medium text-dark dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded-md border ${
              validationErrors.password
                ? "border-red-500"
                : "border-transparent"
            } py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp`}
          />
          {validationErrors.password && (
            <p className="mt-2 text-sm text-red-600">
              {validationErrors.password}
            </p>
          )}
        </div>

        <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
          <div className="mb-4 sm:mb-0">
            <label
              htmlFor="checkboxLabel"
              className="flex cursor-pointer select-none items-center text-sm font-medium text-body-color"
            >
              <div className="relative">
                <input type="checkbox" id="checkboxLabel" className="sr-only" />
                <div className="box mr-4 flex h-5 w-5 items-center justify-center rounded border border-body-color border-opacity-20 dark:border-white dark:border-opacity-10">
                  <span className="opacity-0">
                    <svg
                      width="11"
                      height="8"
                      viewBox="0 0 11 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                        fill="white"
                        stroke="white"
                        strokeWidth="0.4"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              Keep me signed in
            </label>
          </div>
          <div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-sm bg-[#4A6CF7] px-9 py-4 text-base font-medium text-white hover:bg-[#4A6CF7]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="relative mb-6">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-body-color dark:bg-[#242B51]">
          Or
        </span>
        <div className="h-[1px] w-full bg-[#E2E8F0] dark:bg-white dark:bg-opacity-10"></div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-white py-4 px-9 text-base font-medium text-gray-700 border border-gray-300 transition duration-300 ease-in-out hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="mr-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_95:967)">
                <path
                  d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                  fill="#4285F4"
                />
                <path
                  d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                  fill="#34A853"
                />
                <path
                  d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                  fill="#EB4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_95:967">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          {googleLoading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>

      {error && (
        <div
          className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {googleError && (
        <div
          className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{googleError}</span>
        </div>
      )}
    </>
  );
};

export default SigninForm;
