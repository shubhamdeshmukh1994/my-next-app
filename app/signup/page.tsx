"use client";
import { supabase } from "@/lib/supabase/client";
import React, { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);

  const handleSignUp = async () => {
    try {
      setIsPending(true);
      setError("");
      if (!email.trim()) {
        setError("Please enter your email address");
        return;
      }
      if (!password) {
        setError("Please enter your password");
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log("SignUp successful!",data);
      if (error) {
        setError(error.message);
        return;
      }
      if (data.user) {
        posthog.identify(data.user.id);
        posthog.capture("user_signed_up");
      }
      setShowVerifyEmail(true);
      // Redirect after 5 seconds
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome
        </h1>

        <p className="text-gray-500 text-center mt-2">Sign up to continue</p>
        {!showVerifyEmail ? (
          <form
            id="sign-form"
            onSubmit={handleSignUp}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-16 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSignUp}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isPending ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
            <div className="mb-4 text-5xl">📧</div>

            <h2 className="mb-2 text-2xl font-semibold">Verify your email</h2>

            <p className="mb-4 text-gray-600">
              We've sent a verification link to
              <br />
              <strong>{email}</strong>
            </p>

            <p className="text-sm text-gray-500">
              Please verify your email before logging in.
            </p>

            <p className="mt-4 text-sm text-blue-600">
              Redirecting to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
