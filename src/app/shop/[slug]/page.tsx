import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { Check, ChevronDown, ChevronRight, MessageCircleHeart } from "lucide-react";
import { getProduct, getProducts, getProductSlugs, getSiteContent } from "@/lib/content";
import { siteUrl } from "@/lib/fallback";
import { formatPrice } from "@/lib/money";
import { enquiryHref } from "@/lib/shop";
import { AddToCart } from "@/components/cart/AddToCart";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { DispatchNote } from "@/components/shop/DispatchNote";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  // Cache Components needs at least one param to prerender the route.
  return slugs.length ? slugs : [{ slug: "mystery-box" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found — Twins Temptations" };
  return {
    title: `${product.name} — Twins Temptations`,
    description: product.summary,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { title: product.name, description: product.summary, images: [{ url: product.images[0].src, alt: product.images[0].alt }] },
  };
}

function Disclosure({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group border-b border-cocoa/15 py-5" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-[16px] font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-3 text-[15px] leading-relaxed text-cocoa/75">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, products, { business, commerce }] = await Promise.all([getProduct(slug), getProducts(), getSiteContent()]);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug).slice(0, 2);
  const purchasable = product.mode === "purchasable" && product.price != null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: product.images.map((i) => i.src),
    brand: { "@type": "Brand", name: business.name },
    ...(purchasable
      ? {
          offers: {
            "@type": "Offer",
            price: product.price!.toFixed(2),
            priceCurrency: "GBP",
            availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${siteUrl}/shop/${product.slug}`,
          },
        }
      : {}),
  };

  return (
    <main id="main" className="px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-[1400px]">
        <nav aria-label="Breadcrumb" className="mb-8 text-[13px] text-cocoa-soft">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-cocoa">Home</Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li>
              <Link href="/shop" className="hover:text-cocoa">Shop</Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li aria-current="page" className="text-cocoa">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-raspberry">
              {purchasable ? (product.available ? "Order online · UK delivery" : "Sold out") : "Made to order"}
            </p>
            <h1 className="font-display mt-4 text-[clamp(2.8rem,6vw,5rem)] font-light leading-[0.95] tracking-[-0.025em]">{product.name}</h1>
            {purchasable && <p className="font-display mt-5 text-[34px]">{formatPrice(product.price!)}</p>}
            <p className="mt-5 max-w-[44ch] text-[18px] leading-relaxed text-cocoa/80">{product.summary}</p>

            <div className="mt-8">
              {purchasable ? (
                <AddToCart product={product} />
              ) : (
                <Link
                  href={enquiryHref(product)}
                  className="inline-flex items-center gap-2 rounded-full bg-raspberry px-8 py-4 text-[15px] font-medium text-cream shadow-[0_10px_30px_-10px_rgba(179,36,90,0.7)] transition-all hover:-translate-y-0.5 hover:bg-raspberry-deep"
                >
                  <MessageCircleHeart className="size-4" aria-hidden /> Enquire about {product.name.toLowerCase()}
                </Link>
              )}
            </div>
            {purchasable && product.available && <DispatchNote className="mt-5 text-cocoa-soft" />}

            {product.highlights.length > 0 && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[15px]">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-blush text-raspberry">
                      <Check className="size-3" aria-hidden />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 border-t border-cocoa/15">
              {product.description.length > 0 && (
                <Disclosure title="Description" open>
                  <div className="space-y-3">
                    <PortableText value={product.description} />
                  </div>
                </Disclosure>
              )}
              {purchasable && (
                <Disclosure title="Delivery">
                  <ul className="space-y-2">
                    {commerce.deliveryNotes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </Disclosure>
              )}
              <Disclosure title="Allergens">{business.allergenNotice}</Disclosure>
              {purchasable && <Disclosure title="Freshness & returns">{commerce.returnsPolicy}</Disclosure>}
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-28" aria-labelledby="more">
            <h2 id="more" className="font-display text-[clamp(2rem,4vw,3.2rem)] font-light">
              You might <em className="font-display-wonk text-raspberry">also like</em>
            </h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-2">
              {others.map((p) => (
                <li key={p.id}>
                  <Link href={`/shop/${p.slug}`} className="group grid grid-cols-[120px_1fr] items-center gap-6 md:grid-cols-[180px_1fr]">
                    <div className="relative aspect-square overflow-hidden rounded-[24px] bg-blush">
                      <Image
                        src={p.images[0].src}
                        alt={p.images[0].alt}
                        fill
                        sizes="180px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ objectPosition: p.images[0].position }}
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-[26px] leading-tight group-hover:text-raspberry">{p.name}</h3>
                      <p className="mt-1 text-[15px] text-cocoa-soft">
                        {p.mode === "purchasable" && p.price != null ? formatPrice(p.price) : "Made to order"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
