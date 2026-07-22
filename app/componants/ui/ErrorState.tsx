"use client";

// Shared body for every route's error.tsx -- each one still needs its own
// error.tsx file (Next.js resolves the nearest one per segment), but they
// can all render this instead of duplicating the same markup.
type ErrorStateProps = {
  title?: string;
  message?: string;
  reset: () => void;
};

const ErrorState = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  reset,
}: ErrorStateProps) => {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-light-200 max-w-md">{message}</p>
      <button
        onClick={reset}
        className="bg-primary hover:bg-primary/90 rounded-[6px] px-6 py-2.5 font-semibold text-black"
      >
        Try again
      </button>
    </section>
  );
};

export default ErrorState;
