import { PortableText } from "next-sanity";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, Truck, Store, Bike } from "lucide-react";
import { getProduct, getSiteContent } from "@/lib/content";
import Link from "next/link";
import { AddToCart } from "@/components/cart/AddToCart";
import type { Heading } from "@/lib/types";
import { openDaysSummary } from "@/lib/hours";
import { Hero } from "@/components/Hero";
import { Bakes } from "@/components/Bakes";
import { EnquiryForm } from "@/components/EnquiryForm";
import { HoursTable } from "@/components/OpenStatus";
import { MaskImage, Reveal } from "@/components/motion";
import { TwinMark } from "@/components/icons";

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`mb-6 flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.22em] ${light ? "text-rose" : "text-raspberry"}`}>
      <TwinMark className="h-3 w-5" />
      {children}
    </p>
  );
}

/** Statement + emphasised second part, as edited in Sanity. */
function Title({ heading, accent = "text-raspberry" }: { heading: Heading; accent?: string }) {
  return (
    <>
      {heading.statement}
      {heading.emphasis && (
        <>
          {" "}
          <em className={`font-display-wonk ${accent}`}>{heading.emphasis}</em>
        </>
      )}
    </>
  );
}

/** Turns "@handle" in plain text into an Instagram link. */
function WithHandle({ text, href }: { text: string; href: string }) {
  const parts = text.split(/(@[\w.]+)/);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("@") ? (
          <a key={i} href={href} target="_blank" rel="noopener" className="font-medium text-raspberry underline decoration-raspberry/30 underline-offset-4 hover:decoration-raspberry">
            {p}
          </a>
        ) : (
          p
        ),
      )}
    </>
  );
}

const h2 = "font-display text-[clamp(2.6rem,6vw,5.2rem)] font-light leading-[0.98] tracking-[-0.025em]";

export default async function Home() {
  const [{ business, hero, story, bakesSection, bakes, mysteryBox, celebrations, visit }, boxProduct] = await Promise.all([
    getSiteContent(),
    getProduct("mystery-box"),
  ]);
  const marqueeItems = bakes.map((b) => b.name);

  return (
    <>
      <main id="main">
        <Hero hero={hero} business={business} />

        {/* Marquee */}
        <div className="overflow-hidden border-y border-raspberry-deep bg-raspberry py-5 text-cream" aria-hidden>
          <div className="flex w-max animate-marquee">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {marqueeItems.map((m, i) => (
                  <span key={`${m}-${i}`} className="flex items-center">
                    <span className="font-display px-7 text-[clamp(1.5rem,3vw,2.4rem)] italic">{m}</span>
                    <TwinMark className="h-3 w-5 text-rose" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Story */}
        <section id="story" className="relative overflow-hidden px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6 lg:pr-10">
              <Reveal>
                <Eyebrow>Our story</Eyebrow>
                <h2 className={h2}>
                  <Title heading={story.heading} />
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-10 space-y-5 text-[17px] leading-[1.75] text-cocoa/80">
                  <PortableText value={story.body} />
                </div>
              </Reveal>
              {story.quote && (
                <Reveal delay={0.2}>
                  <figure className="mt-12 border-l-2 border-raspberry pl-6">
                    <blockquote className="font-display text-[22px] italic leading-snug text-cocoa md:text-[26px]">
                      &ldquo;{story.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 text-[13px] uppercase tracking-[0.18em] text-cocoa-soft">{story.quoteAttribution}</figcaption>
                  </figure>
                </Reveal>
              )}
            </div>

            <div className="relative lg:col-span-6">
              <MaskImage
                src={story.image.src}
                alt={story.image.alt}
                position={story.image.position}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/5] rounded-t-[999px] md:aspect-[5/6]"
              />
              <div className="absolute -bottom-8 -left-2 w-[46%] md:-left-10">
                <MaskImage
                  src={story.secondaryImage.src}
                  alt={story.secondaryImage.alt}
                  position={story.secondaryImage.position}
                  sizes="(min-width: 1024px) 20vw, 45vw"
                  className="aspect-square rounded-full border-[6px] border-cream"
                />
              </div>
              <ol className="absolute -right-1 top-8 hidden space-y-3 md:block">
                {story.milestones.map((m) => (
                  <li key={m.key} className="rounded-full bg-cream/90 px-4 py-2 text-[13px] shadow-sm backdrop-blur">
                    <span className="font-display italic text-raspberry">{m.when}</span> · {m.what}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Bakes */}
        <section id="bakes" className="bg-blush px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1400px]">
            <Reveal className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
              <div>
                <Eyebrow>On the counter</Eyebrow>
                <h2 className={`${h2} max-w-[14ch]`}>
                  <Title heading={bakesSection.heading} />
                </h2>
              </div>
              <p className="max-w-[34ch] text-[16px] leading-relaxed text-cocoa/75">
                <WithHandle text={bakesSection.intro} href={business.social.instagram} />
              </p>
            </Reveal>
            <Bakes bakes={bakes} />
          </div>
        </section>

        {/* Mystery Box */}
        <section id="mystery-box" className="relative overflow-hidden bg-cocoa px-5 py-24 text-cream md:px-10 md:py-36">
          <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-raspberry/25 blur-3xl" aria-hidden />
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-2 lg:gap-24">
            <MaskImage
              src={mysteryBox.image.src}
              alt={mysteryBox.image.alt}
              position={mysteryBox.image.position}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/5] rounded-[28px]"
            />
            <div>
              <Reveal>
                <Eyebrow light>{mysteryBox.eyebrow}</Eyebrow>
                <h2 className="font-display text-[clamp(2.8rem,6.5vw,5.8rem)] font-light leading-[0.95] tracking-[-0.025em]">
                  <Title heading={mysteryBox.heading} accent="text-rose" />
                </h2>
                <p className="mt-8 max-w-[44ch] text-[17px] leading-[1.75] text-cream/75">{mysteryBox.description}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <dl className="mt-12 grid grid-cols-3 border-y border-cream/15">
                  {[
                    [mysteryBox.price, "per box"],
                    [String(mysteryBox.treatCount), "treats inside"],
                    [mysteryBox.shelfLife, "days shelf life"],
                  ].map(([big, small]) => (
                    <div key={small} className="border-r border-cream/15 py-6 pr-3 last:border-r-0 [&:not(:first-child)]:pl-5">
                      <dt className="sr-only">{small}</dt>
                      <dd>
                        <span className="font-display block text-[clamp(2rem,4vw,3.2rem)] leading-none">{big}</span>
                        <span className="mt-2 block text-[13px] text-cream/60">{small}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-8 space-y-3 text-[15px] text-cream/75">
                  {mysteryBox.deliveryNotes.map((note, i) => {
                    const Icon = i === 0 ? Clock : Truck;
                    return (
                      <li key={note} className="flex gap-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden />
                        {note}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                  {boxProduct?.mode === "purchasable" ? (
                    <AddToCart product={boxProduct} tone="dark" showQty={false} />
                  ) : null}
                  <Link
                    href="/shop/mystery-box"
                    className="group inline-flex items-center gap-2 text-[15px] font-medium text-cream underline decoration-cream/30 underline-offset-[6px] hover:decoration-cream"
                  >
                    See what could be inside
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </div>
                <p className="mt-5 text-[12px] leading-relaxed text-cream/50">{business.allergenNotice}</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Ways to get your fix */}
        <section className="px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <Reveal>
              <Eyebrow>Three ways to get your fix</Eyebrow>
            </Reveal>
            <ol className="border-t border-cocoa/15">
              {[
                {
                  icon: Store,
                  title: "Pop into the pink shop",
                  text: `${business.address.street}, ${business.address.postcode}. ${openDaysSummary(business.hours)}.`,
                  cta: "Get directions",
                  href: business.mapsUrl,
                },
                {
                  icon: Bike,
                  title: "Order on Deliveroo",
                  text: `Local to ${business.address.locality}? Get treats delivered the same day through Deliveroo.`,
                  cta: "Open Deliveroo",
                  href: business.deliverooUrl,
                },
                {
                  icon: Truck,
                  title: "Posted to your door",
                  text: "Anywhere in the UK, straight from the online shop, dispatched Tuesday to Friday.",
                  cta: "Shop online",
                  href: "/shop",
                },
              ].map((w, i) => (
                <li key={w.title} className="border-b border-cocoa/15">
                  <Reveal delay={i * 0.08} className="group grid items-center gap-4 py-8 md:grid-cols-[6rem_1fr_1.2fr_auto] md:gap-10 md:py-10">
                    <span className="font-display text-[clamp(3rem,6vw,5rem)] font-light italic leading-none text-rose transition-colors group-hover:text-raspberry">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display flex items-center gap-3 text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">
                      <w.icon className="size-6 shrink-0 text-raspberry" aria-hidden />
                      {w.title}
                    </h3>
                    <p className="text-[16px] leading-relaxed text-cocoa/75">{w.text}</p>
                    <a
                      href={w.href}
                      {...(w.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                      className="inline-flex items-center gap-1.5 justify-self-start whitespace-nowrap rounded-full border border-cocoa/25 px-5 py-3 text-[14px] font-medium transition-colors hover:border-raspberry hover:bg-raspberry hover:text-cream"
                    >
                      {w.cta} <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Proof */}
        <section className="scallop-bottom bg-rose/60 px-5 pb-28 pt-20 md:px-10" aria-label="At a glance">
          <dl className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-12 md:grid-cols-4">
            {[
              [business.googleRating.value.toFixed(1), `Google rating from ${business.googleRating.count} reviews`, business.mapsUrl],
              [String(business.hygieneRating.value), `Food hygiene rating, inspected ${business.hygieneRating.inspected}`, null],
              ["~10", "years of baking, from home kitchen to shop", null],
              [business.openedYear, `The pink shop opened in ${business.openedShop}`, null],
            ].map(([big, small, href]) => (
              <Reveal key={small} className="px-2 text-center">
                <dt className="sr-only">{small}</dt>
                <dd>
                  <span className="font-display block text-[clamp(3.4rem,8vw,6.5rem)] font-light leading-none tracking-[-0.03em] text-raspberry">
                    {big}
                  </span>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener" className="mx-auto mt-3 block max-w-[20ch] text-[14px] text-cocoa/75 underline decoration-cocoa/20 underline-offset-4 hover:text-cocoa">
                      {small}
                    </a>
                  ) : (
                    <span className="mx-auto mt-3 block max-w-[20ch] text-[14px] text-cocoa/75">{small}</span>
                  )}
                </dd>
              </Reveal>
            ))}
          </dl>
        </section>

        {/* Celebrations */}
        <section id="celebrations" className="px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Reveal>
                  <Eyebrow>Celebrations & corporate</Eyebrow>
                  <h2 className={h2}>
                    <Title heading={celebrations.heading} />
                  </h2>
                  <p className="mt-8 max-w-[42ch] text-[17px] leading-[1.75] text-cocoa/80">{celebrations.body}</p>
                </Reveal>
                <MaskImage
                  src={celebrations.image.src}
                  alt={celebrations.image.alt}
                  position={celebrations.image.position}
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="mt-12 aspect-[4/3] rounded-[24px]"
                />
              </div>
              <Reveal delay={0.1} className="lg:col-span-7 lg:pt-6">
                <div className="rounded-[28px] bg-blush p-6 sm:p-10 md:p-14">
                  <h3 className="font-display mb-2 text-[28px] md:text-[34px]">Make an enquiry</h3>
                  <p className="mb-10 text-[15px] text-cocoa-soft">
                    Or email{" "}
                    <a href={`mailto:${business.email}`} className="font-medium text-raspberry underline underline-offset-4">
                      {business.email}
                    </a>
                  </p>
                  <EnquiryForm email={business.email} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="bg-blush px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-2 lg:gap-24">
            <div>
              <Reveal>
                <Eyebrow>Visit the pink shop</Eyebrow>
                <h2 className={h2}>
                  <Title heading={visit.heading} />
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <ul className="mt-12 space-y-6 text-[17px]">
                  <li className="flex gap-4">
                    <MapPin className="mt-1 size-5 shrink-0 text-raspberry" aria-hidden />
                    <a href={business.mapsUrl} target="_blank" rel="noopener" className="hover:text-raspberry">
                      {business.address.street}
                      <br />
                      {business.address.locality} {business.address.postcode}
                    </a>
                  </li>
                  <li className="flex gap-4">
                    <Phone className="mt-1 size-5 shrink-0 text-raspberry" aria-hidden />
                    <a href={business.phoneHref} className="hover:text-raspberry">{business.phone}</a>
                  </li>
                  <li className="flex gap-4">
                    <Mail className="mt-1 size-5 shrink-0 text-raspberry" aria-hidden />
                    <a href={`mailto:${business.email}`} className="break-all hover:text-raspberry">{business.email}</a>
                  </li>
                </ul>
                <div className="mt-12 max-w-md">
                  <h3 className="mb-3 text-[12px] font-medium uppercase tracking-[0.22em] text-cocoa-soft">Opening hours</h3>
                  <HoursTable hours={business.hours} />
                  {visit.note && <p className="mt-4 text-[13px] text-cocoa-soft">{visit.note}</p>}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15} className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-rose/40 shadow-[0_30px_60px_-30px_rgba(53,25,26,0.35)]">
              <iframe
                title={`Map showing ${business.name} at ${business.address.street}, ${business.address.locality}`}
                src={business.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[35%] sepia-[15%]"
              />
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener"
                className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-cocoa px-6 py-3 text-[14px] font-medium text-cream shadow-lg hover:bg-raspberry"
              >
                Open in Google Maps <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>
      </main>


    </>
  );
}
