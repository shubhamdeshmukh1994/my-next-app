"use client";

// Root-level error boundary -- catches any thrown render/data error that
// isn't already caught by a more specific error.tsx further down the tree
// (e.g. app/events/[slug]/error.tsx handles that segment on its own).
import { useEffect } from "react";
import ErrorState from "@/app/componants/ui/ErrorState";

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return <ErrorState reset={reset} />;
};

export default GlobalError;
