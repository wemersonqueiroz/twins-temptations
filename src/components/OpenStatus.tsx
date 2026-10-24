"use client";

import { useEffect, useState } from "react";
import type { DayHours } from "@/lib/types";

type Status = { open: boolean; label: string; today: number };

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const fmt = (t: string) => {
  const h = Number(t.slice(0, 2));
  return `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`;
};
// hours are ordered Monday..Sunday; convert from JS day index.
const hoursFor = (hours: DayHours[], jsDay: number) => hours[(jsDay + 6) % 7];

export function computeStatus(hours: DayHours[]): Status {
  const { day, minutes } = londonNow();
  const h = hoursFor(hours, day);
  if (h.open && h.close && minutes >= toMin(h.open) && minutes < toMin(h.close)) {
    return { open: true, label: `Open now · until ${fmt(h.close)}`, today: day };
  }
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    const next = hoursFor(hours, d);
    if (!next.open) continue;
    if (i === 0 && minutes >= toMin(next.open)) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[d];
    return { open: false, label: `Closed · opens ${when} ${fmt(next.open)}`, today: day };
  }
  return { open: false, label: "Closed", today: day };
}

export function useOpenStatus(hours: DayHours[]) {
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    const tick = () => setStatus(computeStatus(hours));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);
  return status;
}

export function OpenStatus({ hours, className = "" }: { hours: DayHours[]; className?: string }) {
  const status = useOpenStatus(hours);
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-live="polite">
      <span
        className={`size-2 rounded-full ${status?.open ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]" : "bg-raspberry/70"}`}
        aria-hidden
      />
      {status ? status.label : "Tue–Fri · 10am–4pm"}
    </span>
  );
}

/** Hours table that highlights today's row. */
export function HoursTable({ hours }: { hours: DayHours[] }) {
  const status = useOpenStatus(hours);
  const todayName = status ? DAYS[status.today] : null;
  return (
    <dl className="divide-y divide-cocoa/10 border-y border-cocoa/10">
      {hours.map((h) => {
        const isToday = h.day === todayName;
        return (
          <div
            key={h.day}
            className={`flex items-baseline justify-between py-3 text-[15px] ${isToday ? "font-semibold text-raspberry" : ""}`}
          >
            <dt className="flex items-center gap-2">
              {h.day}
              {isToday && <span className="text-[11px] uppercase tracking-[0.18em]">Today</span>}
            </dt>
            <dd className={h.open ? "" : "text-cocoa-soft"}>
              {h.open && h.close ? `${fmt(h.open)} – ${fmt(h.close)}` : "Closed"}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
