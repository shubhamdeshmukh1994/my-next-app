"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

function ExploreBtn() {
  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={() => {
        console.log("btn click");
        posthog.capture("explore_events_clicked");
      }}
    >
      <Link href='#events'>
        Explore Events
        <Image
          src="/icons/arrow-down.svg"
          alt="down-arrow"
          width={24}
          height={24}
          className="h-6 w-6"
        />
      </Link>
    </button>
  );
}

export default ExploreBtn;
