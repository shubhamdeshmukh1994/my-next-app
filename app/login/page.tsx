"use client";
import { supabase } from "@/lib/supabase/client";
import React, { useState, useActionState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import posthog from "posthog-js";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      posthog.capture("user_login_failed", {
        error_message: error.message,
      });
      setIsPending(false);
      return;
    }

    posthog.identify(data.user.id);
    posthog.capture("user_logged_in");

    router.replace("/");
    router.refresh();
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <div className="bg-dark-100 border-dark-200 card-shadow w-full max-w-md rounded-[10px] border px-8 py-10">
        <h1 className="text-center text-3xl font-bold">Welcome Back</h1>

        <p className="text-light-200 mt-2 text-center">Sign in to continue</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
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
            onClick={handleLogin}
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 w-full rounded-[6px] py-3 font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex justify-between text-sm">
            <a href="#" className="text-primary hover:underline">
              Forgot Password?
            </a>

            <Link href="/signup" className="text-primary hover:underline">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
