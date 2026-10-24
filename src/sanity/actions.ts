"use server";

import { updateTag } from "next/cache";
import { parseTags } from "next-sanity/live";

/**
 * Runs when Sanity reports published changes. The default only marks the
 * cache stale (new content on the next visit); this expires it immediately
 * and asks <SanityLive /> to refresh open pages, so edits appear live.
 */
export async function expireSanityTags(unsafeTags: unknown) {
  for (const tag of parseTags(unsafeTags).tags) {
    updateTag(tag);
  }
  return "refresh" as const;
}
