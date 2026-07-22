"use client";

// Distinct from app/error.tsx: this only fires when the ROOT LAYOUT itself
// (app/layout.tsx) throws -- something error.tsx can't catch, since
// error.tsx boundaries wrap a layout's children, not the layout doing the
// wrapping. Because the root layout is gone when this activates, it has to
// render its own <html>/<body> (and re-import globals.css) rather than
// relying on layout.tsx for either. Only activates in production builds --
// `next dev` shows its own error overlay instead.
import { useEffect } from "react";
import ErrorState from "@/app/componants/ui/ErrorState";
import "./globals.css";

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error("Root layout crashed:", error);
  }, [error]);

  return (
    <html lang="en" data-theme="winter">
      <body>
        <ErrorState
          title="The app failed to load"
          message="Something went wrong at the top level. Please try again."
          reset={reset}
        />
      </body>
    </html>
  );
};

export default GlobalError;
