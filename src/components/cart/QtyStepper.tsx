"use client";

import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  value,
  max,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (qty: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const btn = size === "sm" ? "size-9" : "size-12";
  return (
    <div
      className={`inline-flex items-center rounded-full border border-cocoa/20 bg-cream/60 ${size === "sm" ? "text-[14px]" : "text-[16px]"}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full transition-colors hover:bg-blush disabled:opacity-35`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="min-w-8 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full transition-colors hover:bg-blush disabled:opacity-35`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
