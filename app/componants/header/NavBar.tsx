"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import posthog from "posthog-js";

type NavUser = {
  name: string;
  avatarUrl: string | null;
};

// "Shubham Solanke" -> "SS"; single-word names fall back to one letter.
const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

export const NavBar = () => {
  const [user, setUser] = useState<NavUser | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        return;
      }

      const identityData = authUser.identities?.[0]?.identity_data;

      setUser({
        name: identityData?.full_name ?? authUser.email ?? "User",
        avatarUrl: identityData?.avatar_url ?? null,
      });
    };

    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      posthog.capture("user_logged_out");
      posthog.reset();
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.log("Error : ",error)
    }
  };

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image
            src="/icons/logo.png"
            alt="DevEvents logo"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <p>DevEvents</p>
        </Link>
        <ul>
          <Link href="/">Home</Link>
          <Link href="/">Events</Link>
          <Link href="/events/create">Create Events</Link>
          <Link href="/users">Users</Link>
        </ul>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="bg-primary flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-black"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </button>

            {open && (
              <div className="bg-dark-100 border-dark-200 card-shadow absolute right-0 mt-2 w-44 overflow-hidden rounded-[10px] border">
                <button
                  onClick={handleSignOut}
                  className="text-destructive hover:bg-dark-200 block w-full px-4 py-3 text-left text-sm"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
