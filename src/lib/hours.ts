import type { DayHours } from "./types";

/** "Tue–Fri · 10am–4pm" style summary from the hours table. */
export function openDaysSummary(hours: DayHours[]) {
  const open = hours.filter((h) => h.open && h.close);
  if (!open.length) return "Opening hours on our socials";
  const fmt = (t: string) => {
    const h = Number(t.slice(0, 2));
    const m = t.slice(3);
    return `${h % 12 || 12}${m !== "00" ? `:${m}` : ""}${h >= 12 ? "pm" : "am"}`;
  };
  const sameTimes = open.every((h) => h.open === open[0].open && h.close === open[0].close);
  const days = open.length > 1 ? `${open[0].day.slice(0, 3)}–${open[open.length - 1].day.slice(0, 3)}` : open[0].day;
  return sameTimes ? `${days} · ${fmt(open[0].open!)}–${fmt(open[0].close!)}` : `${days}, see hours below`;
}
