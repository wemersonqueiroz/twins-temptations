"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { getImageProps } from "next/image";
import { ArrowDown, ArrowUpRight, Star } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import type { Business, SiteContent } from "@/lib/types";
import { OpenStatus } from "./OpenStatus";

type Props = {
  hero: SiteContent["hero"];
  business: Pick<Business, "mysteryBoxUrl" | "mapsUrl" | "googleRating" | "hours">;
};

export function Hero({ hero, business }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Three depth layers: photo drifts slowest, light a little faster, copy fastest.
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const lightY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "35%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-blush">
      {/* Layer 1 — the cake, with a slow cinematic push-in */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <div className="absolute inset-0 animate-push will-change-transform">
          <HeroPicture desktop={hero.image} mobile={hero.mobileImage} />
        </div>
      </motion.div>

      {/* Layer 2 — window light drifting across */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: lightY }} aria-hidden>
        <div className="absolute -left-1/4 top-0 h-full w-3/4 animate-drift bg-[radial-gradient(ellipse_at_center,rgba(255,250,245,0.55),transparent_60%)] blur-2xl" />
      </motion.div>

      {/* Legibility wash */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,#fbe3e6_0%,rgba(251,227,230,0.94)_45%,rgba(251,227,230,0.55)_68%,transparent_85%)] lg:bg-none lg:bg-gradient-to-r lg:from-blush/95 lg:via-blush/45 lg:to-transparent"
        aria-hidden
      />

      {/* Layer 3 — copy */}
      <motion.div
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-start px-5 pt-32 lg:justify-center lg:px-10 lg:pt-16"
        style={{ y: copyY, opacity: fade }}
      >
        <p
          className="fade-in mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cocoa-soft"
          style={{ animationDelay: "0.2s" }}
        >
          <span>{hero.eyebrow}</span>
          <span className="hidden h-px w-8 bg-cocoa/30 sm:block" aria-hidden />
          <OpenStatus hours={business.hours} className="normal-case tracking-normal text-[13px]" />
        </p>

        <h1 className="font-display max-w-[11ch] text-[clamp(3.1rem,9.5vw,8.6rem)] font-light leading-[0.92] tracking-[-0.03em] text-cocoa">
          <RiseWords text={hero.heading.statement} delay={0.15} className="block" />
          {hero.heading.emphasis && (
            <RiseWords text={hero.heading.emphasis} delay={0.4} className="font-display-wonk block italic text-raspberry" />
          )}
        </h1>

        <div className="fade-up" style={{ animationDelay: "0.45s" }}>
          <p className="mt-7 max-w-[34ch] text-[17px] leading-relaxed text-cocoa/80 lg:text-[19px]">{hero.intro}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={business.mysteryBoxUrl}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-2 rounded-full bg-raspberry px-7 py-4 text-[15px] font-medium text-cream shadow-[0_10px_30px_-10px_rgba(179,36,90,0.7)] transition-all hover:-translate-y-0.5 hover:bg-raspberry-deep"
            >
              Order a Mystery Box
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href="#visit"
              className="inline-flex items-center gap-2 rounded-full border border-cocoa/25 bg-cream/40 px-7 py-4 text-[15px] font-medium text-cocoa backdrop-blur-sm transition-colors hover:border-cocoa hover:bg-cream/70"
            >
              Visit the shop
            </a>
          </div>
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-2 text-[14px] text-cocoa/75 hover:text-cocoa"
          >
            <span className="flex text-raspberry" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </span>
            {business.googleRating.value.toFixed(1)} on Google · {business.googleRating.count} reviews
          </a>
        </div>
      </motion.div>

      <a
        href="#story"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-cocoa/60 lg:flex"
      >
        Scroll
        <ArrowDown className="size-4 animate-bounce" aria-hidden />
      </a>
      <p className="absolute bottom-4 right-5 z-10 text-[10px] uppercase tracking-[0.2em] text-cocoa/60 lg:right-10">
        Illustrative imagery
      </p>
    </section>
  );
}

function RiseWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <span className="rise inline-block" style={{ animationDelay: `${delay + i * 0.08}s` }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

/** One <picture> so phones only download the portrait crop. Focal points come from Sanity hotspots. */
function HeroPicture({ desktop, mobile }: { desktop: SiteContent["hero"]["image"]; mobile: SiteContent["hero"]["mobileImage"] }) {
  const common = { fill: true, preload: true, sizes: "100vw" } as const;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktop.src, alt: desktop.alt });
  const { props: mobileProps } = getImageProps({ ...common, src: mobile.src, alt: mobile.alt });
  const style = {
    ...mobileProps.style,
    "--pos-m": mobile.position ?? "50% 100%",
    "--pos-d": desktop.position ?? "70% 50%",
  } as CSSProperties;
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktopSrcSet} />
      <img
        {...mobileProps}
        alt={mobile.alt}
        style={style}
        className="object-cover [object-position:var(--pos-m)] lg:[object-position:var(--pos-d)]"
      />
    </picture>
  );
}
