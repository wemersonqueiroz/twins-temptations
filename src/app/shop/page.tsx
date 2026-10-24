import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircleHeart, Truck } from "lucide-react";
import { getProducts, getSiteContent } from "@/lib/content";
import { formatPrice } from "@/lib/money";
import { enquiryHref } from "@/lib/shop";
import { TwinMark } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { DispatchNote } from "@/components/shop/DispatchNote";

export const metadata: Metadata = {
  title: "Shop — Twins Temptations",
  description: "Order the Twins Temptations Mystery Box for UK delivery, or enquire about celebration cakes and corporate gifts.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, { commerce }] = await Promise.all([getProducts(), getSiteContent()]);
  const online = products.filter((p) => p.mode === "purchasable");
  const madeToOrder = products.filter((p) => p.mode === "madeToOrder");

  return (
    <main id="main" className="pt-28 md:pt-36">
      {/* Header */}
      <section className="px-5 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="mb-6 flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.22em] text-raspberry">
              <TwinMark className="h-3 w-5" /> The shop
            </p>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <h1 className="font-display max-w-[12ch] text-[clamp(3rem,8vw,7rem)] font-light leading-[0.92] tracking-[-0.03em]">
                Treats, <em className="font-display-wonk text-raspberry">posted.</em>
              </h1>
              <div className="max-w-[38ch] space-y-3 text-[16px] leading-relaxed text-cocoa/75">
                <p>Order online for delivery anywhere in the UK, or tell the twins about your celebration.</p>
                <DispatchNote className="text-raspberry" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Order online */}
      {online.length > 0 && (
        <section className="px-5 pt-16 md:px-10 md:pt-24" aria-labelledby="order-online">
          <div className="mx-auto max-w-[1400px]">
            <h2 id="order-online" className="sr-only">
              Order online
            </h2>
            <ul className={`grid gap-8 ${online.length > 1 ? "md:grid-cols-2" : ""}`}>
              {online.map((p, i) => (
                <li key={p.id}>
                  <Reveal delay={i * 0.06}>
                    <Link
                      href={`/shop/${p.slug}`}
                      className={`group grid overflow-hidden rounded-[32px] bg-blush transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(53,25,26,0.35)] ${
                        online.length === 1 ? "md:grid-cols-[1.1fr_0.9fr]" : ""
                      }`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[520px]">
                        <Image
                          src={p.images[0].src}
                          alt={p.images[0].alt}
                          fill
                          sizes="(min-width: 768px) 55vw, 100vw"
                          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                          style={{ objectPosition: p.images[0].position }}
                        />
                      </div>
                      <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
                        <div>
                          <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-raspberry">
                            {p.available ? "Order online" : "Sold out"}
                          </p>
                          <h3 className="font-display mt-4 text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-[0.95] tracking-[-0.02em]">{p.name}</h3>
                          <p className="mt-5 max-w-[34ch] text-[17px] leading-relaxed text-cocoa/75">{p.summary}</p>
                          {p.highlights.length > 0 && (
                            <ul className="mt-6 flex flex-wrap gap-2">
                              {p.highlights.slice(0, 3).map((h) => (
                                <li key={h} className="rounded-full border border-cocoa/15 px-3 py-1.5 text-[13px] text-cocoa/80">
                                  {h}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex items-end justify-between gap-4">
                          {p.price != null && <span className="font-display text-[44px] leading-none">{formatPrice(p.price)}</span>}
                          <span className="inline-flex items-center gap-2 rounded-full bg-cocoa px-6 py-3.5 text-[15px] font-medium text-cream transition-colors group-hover:bg-raspberry">
                            View & order <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Made to order */}
      {madeToOrder.length > 0 && (
        <section className="px-5 pt-24 md:px-10 md:pt-32" aria-labelledby="made-to-order">
          <div className="mx-auto max-w-[1400px]">
            <Reveal className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 id="made-to-order" className="font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[0.98] tracking-[-0.02em]">
                Made <em className="font-display-wonk text-raspberry">to order.</em>
              </h2>
              <p className="max-w-[36ch] text-[16px] text-cocoa/75">Tell us the date and the idea. The twins will come back to you.</p>
            </Reveal>
            <ul className="grid gap-8 md:grid-cols-2">
              {madeToOrder.map((p, i) => (
                <li key={p.id}>
                  <Reveal delay={i * 0.06} className="group">
                    <Link href={`/shop/${p.slug}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[999px] bg-blush">
                        <Image
                          src={p.images[0].src}
                          alt={p.images[0].alt}
                          fill
                          sizes="(min-width: 768px) 45vw, 100vw"
                          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                          style={{ objectPosition: p.images[0].position }}
                        />
                      </div>
                      <h3 className="font-display mt-6 text-[32px] leading-tight transition-colors group-hover:text-raspberry">{p.name}</h3>
                    </Link>
                    <p className="mt-2 max-w-[44ch] text-[16px] text-cocoa/75">{p.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={enquiryHref(p)}
                        className="inline-flex items-center gap-2 rounded-full bg-cocoa px-6 py-3 text-[14px] font-medium text-cream hover:bg-raspberry"
                      >
                        <MessageCircleHeart className="size-4" aria-hidden /> Enquire
                      </Link>
                      <Link
                        href={`/shop/${p.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-cocoa/25 px-6 py-3 text-[14px] font-medium hover:border-cocoa"
                      >
                        Details
                      </Link>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {products.length === 0 && (
        <p className="mx-auto max-w-[1400px] px-5 pt-16 text-[17px] text-cocoa-soft md:px-10">
          The shop is being restocked. Check back soon, or pop into the shop.
        </p>
      )}

      {/* Delivery & policies */}
      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-10 rounded-[32px] bg-cocoa p-8 text-cream md:grid-cols-2 md:p-14">
          <div>
            <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em] text-rose">
              <Truck className="size-4" aria-hidden /> Delivery
            </p>
            <ul className="mt-5 space-y-3 text-[16px] leading-relaxed text-cream/80">
              {commerce.deliveryNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-rose">Freshness & returns</p>
            <p className="mt-5 text-[16px] leading-relaxed text-cream/80">{commerce.returnsPolicy}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
