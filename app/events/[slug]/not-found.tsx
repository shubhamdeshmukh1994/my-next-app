import Link from "next/link";

// Rendered whenever notFound() is called from within this route segment
// (EventDetails calls it when the slug doesn't resolve to a real event).
const EventNotFound = () => {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">Event not found</h2>
      <p className="text-light-200 max-w-md">
        The event you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="bg-primary hover:bg-primary/90 rounded-[6px] px-6 py-2.5 font-semibold text-black"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default EventNotFound;
