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
    <section className="flex min-h-[70vh] items-center justify-center">
      <div className="bg-dark-100 border-dark-200 card-shadow w-full max-w-md rounded-[10px] border px-8 py-10">
        <h1 className="text-center text-3xl font-bold">Welcome</h1>

        <p className="text-light-200 mt-2 text-center">Sign up to continue</p>
        {!showVerifyEmail ? (
          <form
            id="sign-form"
            onSubmit={handleSignUp}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="text-light-200 mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-dark-200 placeholder:text-light-200 w-full rounded-[6px] px-5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-light-200 mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-dark-200 placeholder:text-light-200 w-full rounded-[6px] px-5 py-2.5 pr-16 focus:outline-none focus:ring-1 focus:ring-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-primary absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium hover:opacity-80"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border-destructive text-destructive rounded-[6px] border px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSignUp}
              className="bg-primary hover:bg-primary/90 w-full rounded-[6px] py-3 font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div className="bg-dark-200 rounded-[6px] p-8 text-center">
            <div className="mb-4 text-5xl">📧</div>

            <h2 className="mb-2 text-2xl font-semibold">Verify your email</h2>

            <p className="text-light-200 mb-4">
              We've sent a verification link to
              <br />
              <strong className="text-foreground">{email}</strong>
            </p>

            <p className="text-light-200 text-sm">
              Please verify your email before logging in.
            </p>

            <p className="text-primary mt-4 text-sm">
              Redirecting to login...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
