"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F8F5F2] px-6 text-center text-[#1C1C1C]">
      <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">Something went wrong</h1>
      <p className="max-w-md text-secondary">
        The page hit an unexpected error. Try again, or run a clean dev build:{" "}
        <code className="rounded bg-black/[0.06] px-2 py-1 text-sm">npm run dev:clean</code>
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-[#1C1C1C] px-8 py-3 text-sm font-semibold text-[#F8F5F2] transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
