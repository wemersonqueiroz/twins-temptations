import { cacheLife } from "next/cache";
import { defineLive, type DefinedFetchType } from "next-sanity/live";
import { client } from "./client";

// Server-only token. Not set yet: the site only reads published content.
const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});

/**
 * The app's single 'use cache' boundary. sanityFetch tags the cache entry,
 * and <SanityLive /> invalidates it the moment content is published.
 */
export const cachedSanity: DefinedFetchType = async (options) => {
  "use cache";
  const result = await sanityFetch(options);
  // Safety net: live events are relayed by visitors' browsers, so with nobody
  // on the site the cache would otherwise stay as-is. Refresh every 5 minutes.
  cacheLife({ revalidate: 300 });
  return result;
};
