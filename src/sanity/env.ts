// Public values: safe to ship to the browser.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "i02j10kl";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// Pinned on purpose. Bump deliberately after reading the API changelog.
export const apiVersion = "2026-10-24";
