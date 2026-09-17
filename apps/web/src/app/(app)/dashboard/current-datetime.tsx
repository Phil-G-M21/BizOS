"use client";

import { useEffect, useState } from "react";

export function CurrentDateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="text-sm font-medium text-slate-500">
        {now
          ? now.toLocaleDateString("en-GH", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "Africa/Accra",
            })
          : "Loading..."}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-500">
        {now
          ? now.toLocaleTimeString("en-GH", {
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "Africa/Accra",
            })
          : "--:--:--"}
      </div>
    </>
  );
}
