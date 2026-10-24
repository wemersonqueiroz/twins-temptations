import type { PortableTextBlock } from "next-sanity";
import type { PRODUCT_QUERY_RESULT, PRODUCTS_QUERY_RESULT, SITE_CONTENT_QUERY_RESULT } from "../../sanity.types";
import { urlFor } from "@/sanity/image";
import { cachedSanity } from "@/sanity/live";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY, PRODUCTS_QUERY, SITE_CONTENT_QUERY } from "@/sanity/queries";
import { fallback } from "./fallback";
import type { DayHours, Heading, Img, Product, SiteContent } from "./types";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

type SanityImg = {
  alt: string | null;
  hotspot: { x?: number; y?: number } | null;
  asset: { _id: string; url: string | null } | null;
} | null | undefined;

/** Sanity image → URL + alt + focal point (from the editor's hotspot). */
function img(source: SanityImg, width: number, fb: Img): Img {
  if (!source?.asset?._id) return fb;
  const { x, y } = source.hotspot ?? {};
  return {
    src: urlFor(source).width(width).quality(82).url(),
    alt: source.alt || fb.alt,
    position: x != null && y != null ? `${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%` : fb.position,
  };
}

const text = (v: string | null | undefined, fb: string) => (v && v.trim() ? v : fb);
const num = (v: number | null | undefined, fb: number) => (typeof v === "number" ? v : fb);
const heading = (h: { statement: string | null; emphasis: string | null } | null | undefined, fb: Heading): Heading =>
  h?.statement ? { statement: h.statement, emphasis: h.emphasis ?? undefined } : fb;

function monthYear(date: string | null | undefined, fb: string) {
  if (!date) return fb;
  const d = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(d.getTime())
    ? fb
    : new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

function hours(rows: NonNullable<SITE_CONTENT_QUERY_RESULT["settings"]>["openingHours"] | undefined, fb: DayHours[]): DayHours[] {
  if (!rows?.length) return fb;
  return DAYS.map((day) => {
    const row = rows.find((r) => r.day === day);
    return { day, open: row?.opens ?? null, close: row?.closes ?? null };
  });
}

/** Merge what editors entered in Sanity over the built-in content, field by field. */
export function toSiteContent(data: SITE_CONTENT_QUERY_RESULT | null): SiteContent {
  const s = data?.settings;
  const h = data?.home;
  const f = fallback;
  const b = f.business;

  const shopOpened = monthYear(s?.shopOpened, b.openedShop);

  return {
    business: {
      ...b,
      name: text(s?.businessName, b.name),
      tagline: text(s?.tagline, b.tagline),
      email: text(s?.email, b.email),
      phone: text(s?.phone, b.phone),
      phoneHref: s?.phone ? `tel:${s.phone.replace(/[^\d+]/g, "").replace(/^0/, "+44")}` : b.phoneHref,
      address: {
        street: text(s?.address?.street, b.address.street),
        locality: text(s?.address?.locality, b.address.locality),
        postcode: text(s?.address?.postcode, b.address.postcode),
        country: text(s?.address?.country, b.address.country),
      },
      shopUrl: text(s?.ordering?.onlineShopUrl, b.shopUrl),
      mysteryBoxUrl: text(s?.ordering?.mysteryBoxUrl, b.mysteryBoxUrl),
      deliverooUrl: text(s?.ordering?.deliverooUrl, b.deliverooUrl),
      mapsUrl: text(s?.ordering?.googleMapsUrl, b.mapsUrl),
      social: {
        instagram: text(s?.social?.instagram, b.social.instagram),
        facebook: text(s?.social?.facebook, b.social.facebook),
        tiktok: text(s?.social?.tiktok, b.social.tiktok),
      },
      googleRating: { value: num(s?.googleRating?.value, b.googleRating.value), count: num(s?.googleRating?.reviewCount, b.googleRating.count) },
      hygieneRating: { value: num(s?.hygieneRating?.value, b.hygieneRating.value), inspected: monthYear(s?.hygieneRating?.inspected, b.hygieneRating.inspected) },
      openedShop: shopOpened,
      openedYear: shopOpened.slice(-4),
      allergenNotice: text(s?.allergenNotice, b.allergenNotice),
      hours: hours(s?.openingHours, b.hours),
    },
    commerce: {
      checkoutMode: s?.commerce?.checkoutMode === "shopify" ? "shopify" : "demo",
      shopifyStoreUrl: text(s?.commerce?.shopifyStoreUrl, f.commerce.shopifyStoreUrl).replace(/\/+$/, ""),
      deliveryNotes: s?.commerce?.deliveryNotes?.length ? s.commerce.deliveryNotes : f.commerce.deliveryNotes,
      returnsPolicy: text(s?.commerce?.returnsPolicy, f.commerce.returnsPolicy),
    },
    seo: {
      title: text(s?.seo?.title, f.seo.title),
      description: text(s?.seo?.description, f.seo.description),
      image: img(s?.seo?.shareImage, 1200, f.seo.image),
    },
    hero: {
      eyebrow: text(h?.hero?.eyebrow, f.hero.eyebrow),
      heading: heading(h?.hero?.heading, f.hero.heading),
      intro: text(h?.hero?.intro, f.hero.intro),
      image: img(h?.hero?.image, 2400, f.hero.image),
      mobileImage: img(h?.hero?.mobileImage, 1200, f.hero.mobileImage),
    },
    story: {
      heading: heading(h?.story?.heading, f.story.heading),
      body: (h?.story?.body?.length ? h.story.body : f.story.body) as PortableTextBlock[],
      quote: text(h?.story?.quote, f.story.quote),
      quoteAttribution: text(h?.story?.quoteAttribution, f.story.quoteAttribution),
      milestones: h?.story?.milestones?.length
        ? h.story.milestones.map((m) => ({ key: m._key, when: m.when ?? "", what: m.what ?? "" }))
        : f.story.milestones,
      image: img(h?.story?.image, 1400, f.story.image),
      secondaryImage: img(h?.story?.secondaryImage, 700, f.story.secondaryImage),
    },
    bakesSection: {
      heading: heading(h?.bakesSection?.heading, f.bakesSection.heading),
      intro: text(h?.bakesSection?.intro, f.bakesSection.intro),
    },
    bakes: data?.bakes?.length
      ? data.bakes.map((x, i) => ({
          key: x._id,
          name: x.name ?? "",
          note: x.description ?? "",
          image: img(x.image, 1400, f.bakes[i % f.bakes.length].image),
        }))
      : f.bakes,
    mysteryBox: {
      eyebrow: text(h?.mysteryBox?.eyebrow, f.mysteryBox.eyebrow),
      heading: heading(h?.mysteryBox?.heading, f.mysteryBox.heading),
      description: text(h?.mysteryBox?.description, f.mysteryBox.description),
      price: text(h?.mysteryBox?.price, f.mysteryBox.price),
      treatCount: num(h?.mysteryBox?.treatCount, f.mysteryBox.treatCount),
      shelfLife: text(h?.mysteryBox?.shelfLife, f.mysteryBox.shelfLife),
      deliveryNotes: h?.mysteryBox?.deliveryNotes?.length ? h.mysteryBox.deliveryNotes : f.mysteryBox.deliveryNotes,
      image: img(h?.mysteryBox?.image, 1400, f.mysteryBox.image),
    },
    celebrations: {
      heading: heading(h?.celebrations?.heading, f.celebrations.heading),
      body: text(h?.celebrations?.body, f.celebrations.body),
      image: img(h?.celebrations?.image, 1400, f.celebrations.image),
    },
    visit: {
      heading: heading(h?.visit?.heading, f.visit.heading),
      note: text(h?.visit?.note, f.visit.note),
    },
  };
}

/** Extra cache tag so the webhook route can expire everything at once. */
export const SITE_CONTENT_TAG = "site-content";

/** Published content, cached and refreshed live by <SanityLive />. Never throws. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const { data } = await cachedSanity({
      query: SITE_CONTENT_QUERY,
      perspective: "published",
      stega: false,
      tags: [SITE_CONTENT_TAG],
    });
    return toSiteContent(data);
  } catch (err) {
    console.error("[sanity] falling back to built-in content:", err);
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Shop

const PLACEHOLDER: Img = { src: "/images/box.jpg", alt: "" };

function toProduct(p: NonNullable<PRODUCT_QUERY_RESULT> | PRODUCTS_QUERY_RESULT[number]): Product {
  const images = (p.images ?? []).map((i) => img(i, 1600, { ...PLACEHOLDER, alt: p.name ?? "" }));
  return {
    id: p._id,
    slug: p.slug ?? "",
    name: p.name ?? "",
    summary: p.summary ?? "",
    highlights: p.highlights ?? [],
    mode: p.sellingMode === "madeToOrder" ? "madeToOrder" : "purchasable",
    price: typeof p.price === "number" ? p.price : null,
    available: p.available !== false,
    maxPerOrder: p.maxPerOrder && p.maxPerOrder > 0 ? p.maxPerOrder : 10,
    shopifyVariantId: p.shopifyVariantId ?? null,
    images: images.length ? images : [{ ...PLACEHOLDER, alt: p.name ?? "" }],
    description: ("description" in p && Array.isArray(p.description) ? p.description : []) as PortableTextBlock[],
  };
}

const fetchOptions = () => ({ perspective: "published" as const, stega: false as const, tags: [SITE_CONTENT_TAG] });

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await cachedSanity({ query: PRODUCTS_QUERY, ...fetchOptions() });
    return (data ?? []).filter((p) => p.slug && p.name).map(toProduct);
  } catch (err) {
    console.error("[sanity] could not load products:", err);
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data } = await cachedSanity({ query: PRODUCT_QUERY, params: { slug }, ...fetchOptions() });
    return data?.slug ? toProduct(data) : null;
  } catch (err) {
    console.error("[sanity] could not load product:", err);
    return null;
  }
}

export async function getProductSlugs(): Promise<{ slug: string }[]> {
  try {
    const { data } = await cachedSanity({ query: PRODUCT_SLUGS_QUERY, ...fetchOptions() });
    return (data ?? []).flatMap((p) => (p.slug ? [{ slug: p.slug }] : []));
  } catch {
    return [];
  }
}
