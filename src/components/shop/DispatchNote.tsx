"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DISPATCH_DAYS = new Set([2, 3, 4, 5]); // Tue–Fri
const CUTOFF = 11 * 60 + 30; // 11:30, Europe/London

function londonNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: DAYS.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

/** Message based on the shop's dispatch policy (Tue–Fri, order by 11:30am). */
function dispatchMessage() {
  const { day, minutes } = londonNow();
  if (DISPATCH_DAYS.has(day) && minutes < CUTOFF) {
    const left = CUTOFF - minutes;
    const h = Math.floor(left / 60);
    const m = left % 60;
    return `Order in the next ${h ? `${h}h ` : ""}${m}m for dispatch today.`;
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (DISPATCH_DAYS.has(d)) return `Order now for dispatch ${i === 1 ? "tomorrow" : `on ${DAYS[d]}`}.`;
  }
  return "";
}

export function DispatchNote({ className = "" }: { className?: string }) {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setMessage(dispatchMessage());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  if (!message) return null;
  return (
    <p className={`flex items-center gap-2 text-[14px] ${className}`} aria-live="polite">
      <Clock className="size-4 shrink-0" aria-hidden />
      <span>
        {message} <span className="opacity-70">Excludes bank holidays.</span>
      </span>
    </p>
  );
}
