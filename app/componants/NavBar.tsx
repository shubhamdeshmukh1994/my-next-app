import Link from "next/link";
import React from "react";
import Image from "next/image";

export const NavBar = () => {
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
            <Link href="/events">Events</Link>
            <Link href="">Create Events</Link>
            <Link href="/users">Users</Link>
          </ul>
        
      </nav>
    </header>
  );
};
