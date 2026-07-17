import ExploreBtn from "@/app/componants/ExploreBtn";
import EventCard from "./componants/EventCard";
import { events } from "@/lib/constants";
export default function Home() {
  return (
    <section id="home" className="text-center">
      <h1  className="text-center">The Hub for Every Dev<br /> Event You Can't Miss</h1>
      <p className="text-center m-5">Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn/>

      <div className='mt-20 y-7'>
        <h3>Fetured Events</h3>
        <ul className='events'>
          {events.map((event)=>(
             <EventCard key={event.slug} {...event} />
          ))}
         
        </ul>
      </div>
      
    </section>
  )
}
