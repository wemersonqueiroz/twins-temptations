"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { Img } from "@/lib/types";

export function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-blush">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              preload={active === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: current.position }}
            />
          </motion.div>
        </AnimatePresence>
        <span className="absolute bottom-4 left-4 rounded-full bg-cream/85 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cocoa-soft backdrop-blur">
          Illustrative imagery
        </span>
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-3" aria-label={`${name} photos`}>
          {images.map((img, i) => (
            <li key={`${img.src}-${i}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active}
                className={`relative block aspect-square w-full overflow-hidden rounded-2xl ring-offset-2 ring-offset-cream transition ${
                  i === active ? "ring-2 ring-raspberry" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt="" fill sizes="120px" className="object-cover" style={{ objectPosition: img.position }} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
