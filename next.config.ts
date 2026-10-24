import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required by next-sanity's defineLive: pages are cached and
  // <SanityLive /> invalidates them when content is published.
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }],
  },
};

export default nextConfig;
