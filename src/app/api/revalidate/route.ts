import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SITE_CONTENT_TAG } from "@/lib/content";

/**
 * Sanity webhook target. Expires the cached site content as soon as anything
 * is published, even when nobody has the site open.
 * Set up in sanity.io/manage → API → Webhooks (see README).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response("SANITY_REVALIDATE_SECRET is not set", { status: 500 });

  try {
    // `true` waits briefly so the Sanity CDN has the new content before we refetch.
    const { isValidSignature } = await parseBody(req, secret, true);
    if (!isValidSignature) return new Response("Invalid signature", { status: 401 });

    revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
    return NextResponse.json({ revalidated: SITE_CONTENT_TAG });
  } catch (err) {
    return new Response((err as Error).message, { status: 500 });
  }
}
