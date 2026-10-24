import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export const InstagramIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
  </svg>
);

export const TikTokIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.4.1-2.7-.3-3.9-1.1v5.6c0 3.5-2.6 5.9-5.9 5.9S4.8 17.4 4.8 14.1c0-3.4 2.9-6 6.5-5.6v2.7c-1.7-.4-3.7.7-3.7 2.9 0 1.6 1.3 2.9 3 2.9 1.8 0 3.1-1.1 3.1-3.4V3h2.9z" />
  </svg>
);

/** Brand mark: two overlapping rounds, one for each twin. */
export const TwinMark = (p: P) => (
  <svg viewBox="0 0 44 28" aria-hidden {...p}>
    <circle cx="14" cy="14" r="12" fill="currentColor" opacity="0.9" />
    <circle cx="30" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);
