"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}
const EventCard = ({ title, image, location, slug, date, time }: Props) => {
  return (
    <Link
      href={`/event/${slug}`}
      className="event-card"
      onClick={() => posthog.capture("event_card_clicked", { event_slug: slug, event_title: title, event_location: location })}
    >
      <Image
        src={image}
        alt={title}
        width={400}
        height={300}
        className="poster"
      />
      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14} className="h-3.5 w-3.5" />
        <p>{location}</p>
      </div>

      <p className="title">{title}</p>
      <div className="datetime">
        <div>
          <Image src="/icons/calendar.svg" alt="date" width={14} height={14} className="h-3.5 w-3.5" />
          <p>{date} </p>
        </div>

        <div>
          <Image src="/icons/clock.svg" alt="time" width={14} height={14} className="h-3.5 w-3.5" />
          <p> {time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
