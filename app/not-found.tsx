import Link from "next/link";

// Root-level fallback -- used for any URL that doesn't match a route at
// all, and for any nested notFound() call without its own closer
// not-found.tsx (e.g. app/events/[slug]/not-found.tsx handles that one).
const NotFound = () => {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">Page not found</h2>
      <p className="text-light-200 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist.
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

export default NotFound;
