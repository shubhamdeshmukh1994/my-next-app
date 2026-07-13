"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";
type HeaderProps = {
  user: {
    name: string;
    email: string;
    id: string;
  };
};

type User = {
    name: string;
    email: string;
    id: string;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<User>();
    const fetchLoggedInUser = async ()=>{
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect("/login");
      }
      console.log("user",user)
      setUserData({
        name: user?.identities?.[0]?.identity_data?.full_name,
        email: "user",
        id: user?.id,
      })
    }
  useEffect(() => {
    fetchLoggedInUser();
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Logout from Supabase
      await supabase.auth.signOut();

      // Redirect to login
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <header className="h-16 border-b border-gray-200 bg-gray-100">
      <div className="mx-auto flex h-full items-center justify-between px-6">
        {/* Logo */}
        <Link href="/dashboard">
          <div className="flex cursor-pointer items-center gap-3">
            <span className="text-2xl">🧑‍💻</span>

            <h1 className="text-2xl font-semibold text-gray-900">DevTinder</h1>
          </div>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-6">
          <span className="text-gray-700">
            Welcome, <span className="font-medium">{userData?.name}</span>
          </span>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 font-semibold text-gray-800"
            >
              {userData?.name?.charAt(0).toUpperCase()}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border bg-white shadow-lg">
                <Link
                  href="/profile"
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  My Profile
                </Link>

                <Link
                  href="/about"
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  Contact Us
                </Link>

                <hr />

                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
