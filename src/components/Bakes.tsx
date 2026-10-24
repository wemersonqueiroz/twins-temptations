"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { SiteContent } from "@/lib/types";

/** Editorial index of the bakes. Hover, focus or tap a line to change the photo. */
export function Bakes({ bakes }: { bakes: SiteContent["bakes"] }) {
  const [active, setActive] = useState(0);
  const current = bakes[Math.min(active, bakes.length - 1)];
  if (!current) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
      <ol className="order-2 border-t border-cocoa/15 lg:order-1">
        {bakes.map((b, i) => {
          const on = i === active;
          return (
            <li key={b.key} className="border-b border-cocoa/15">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                className="group grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-x-3 py-5 text-left md:grid-cols-[3.5rem_1fr_auto] md:py-6"
              >
                <span className={`font-display text-[15px] italic transition-colors ${on ? "text-raspberry" : "text-cocoa/65"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-display text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.02] tracking-[-0.02em] transition-all duration-500 ${
                    on ? "translate-x-2 italic text-raspberry" : "text-cocoa group-hover:translate-x-1"
                  }`}
                >
                  {b.name}
                </span>
                <span
                  className={`col-start-2 mt-1 text-[14px] text-cocoa-soft transition-opacity md:col-start-3 md:mt-0 md:max-w-[22ch] md:text-right ${
                    on ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-70"
                  }`}
                >
                  {b.note}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* On phones the photo sticks under the nav so taps on the list visibly change it */}
      <div className="sticky top-[68px] z-10 order-1 -mx-5 self-start bg-blush px-5 pb-3 pt-2 lg:static lg:order-2 lg:mx-0 lg:bg-transparent lg:p-0">
        <div className="lg:sticky lg:top-28">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-rose/40 lg:aspect-[4/5] lg:rounded-none lg:rounded-t-[999px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.key}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={current.image.src}
                  alt={current.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: current.image.position }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-4 flex items-center justify-between text-[13px] text-cocoa-soft">
            <span className="font-display text-[17px] italic text-cocoa">{current.name}</span>
            <span>Illustrative imagery</span>
          </p>
        </div>
      </div>
    </div>
  );
}
