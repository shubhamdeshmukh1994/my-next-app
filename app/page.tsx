import { Suspense } from "react";
import ExploreBtn from "@/app/componants/events/ExploreBtn";
import EventCard from "./componants/events/EventCard";
import { IEvent } from "@/lib/types";

// Isolated so its uncached fetch can be wrapped in <Suspense> below --
// required by cacheComponents, and lets the static shell around it
// prerender immediately while this streams in.
async function FeaturedEvents() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
  const { events } = await response.json();

  if (!events || events.length === 0) return null;

  return (
    <ul className="events">
      {events.map((event: IEvent) => (
        <EventCard key={event.slug} {...event} />
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <section id="home" className="text-center">
      <h1 className="text-center">The Hub for Every Dev<br /> Event You Can't Miss</h1>
      <p className="text-center m-5">Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn/>

      <div className='mt-20 y-7'>
        <h3>Fetured Events</h3>
        <Suspense fallback={<p>Loading events...</p>}>
          <FeaturedEvents />
        </Suspense>
      </div>
    </section>
  )
}
