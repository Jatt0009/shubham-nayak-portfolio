"use client";

import { useEffect, useState } from "react";

export default function CharacterLoader() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineState = () => setIsOnline(navigator.onLine);
    updateOnlineState();
    window.addEventListener("online", updateOnlineState);
    window.addEventListener("offline", updateOnlineState);

    return () => {
      window.removeEventListener("online", updateOnlineState);
      window.removeEventListener("offline", updateOnlineState);
    };
  }, []);

  return (
    <div className="loader-stage relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <span className="loader-scan-line loader-scan-line--one" />
        <span className="loader-scan-line loader-scan-line--two" />
        <span className="loader-scan-line loader-scan-line--three" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="loader-orbiter">
          <span className="loader-orbit-dot loader-orbit-dot--a" />
          <span className="loader-orbit-dot loader-orbit-dot--b" />
          <span className="loader-orbit-dot loader-orbit-dot--c" />
        </div>

        <div className="loader-character">
          <div className="loader-head">
            <span className="loader-eye loader-eye--left" />
            <span className="loader-eye loader-eye--right" />
            <span className="loader-mouth" />
          </div>
          <div className="loader-body">
            <span className="loader-arm loader-arm--left" />
            <span className="loader-arm loader-arm--right" />
          </div>
          <div className="loader-legs">
            <span className="loader-leg loader-leg--left" />
            <span className="loader-leg loader-leg--right" />
          </div>
        </div>

        <div className="text-center">
          <p className="font-satoshi text-sm font-medium tracking-wide text-foreground/80">
            {isOnline ? "Loading your experience..." : "Connection looks unstable. Waiting to reconnect..."}
          </p>
        </div>
      </div>
    </div>
  );
}
