"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, Lock, ShoppingBag, Truck } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Commerce } from "@/lib/types";
import { formatPrice } from "@/lib/money";
import { useCart } from "@/components/cart/CartProvider";
import { DispatchNote } from "./DispatchNote";

export const LAST_ORDER_KEY = "tt-last-order";

export type DemoOrder = {
  number: string;
  placedAt: string;
  email: string;
  name: string;
  address: string[];
  items: { slug: string; name: string; qty: number; price: number; image: string; imageAlt: string }[];
  subtotal: number;
  giftMessage: string;
};

// UK postcode, e.g. BH10 5AB
const POSTCODE = "^\\s*[A-Za-z]{1,2}\\d[A-Za-z\\d]?\\s*\\d[A-Za-z]{2}\\s*$";

export function CheckoutForm({ commerce }: { commerce: Commerce }) {
  const { items, subtotal, count, ready, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const order: DemoOrder = {
      number: `TT-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      placedAt: new Date().toISOString(),
      email: v("email"),
      name: `${v("firstName")} ${v("lastName")}`.trim(),
      address: [v("address1"), v("address2"), v("city"), v("postcode").toUpperCase()].filter(Boolean),
      items: items.map(({ slug, name, qty, price, image, imageAlt }) => ({ slug, name, qty, price, image, imageAlt })),
      subtotal,
      giftMessage: v("giftMessage"),
    };
    try {
      window.sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch {
      // The confirmation page handles a missing order.
    }
    clear();
    router.push("/checkout/confirmation");
  }

  if (!ready) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-blush text-raspberry">
          <ShoppingBag className="size-8" aria-hidden />
        </div>
        <h1 className="font-display text-[40px]">Your box is empty.</h1>
        <Link href="/shop" className="rounded-full bg-cocoa px-6 py-3 text-[15px] font-medium text-cream hover:bg-raspberry">
          Go to the shop
        </Link>
      </div>
    );
  }

  const field =
    "w-full rounded-2xl border border-cocoa/20 bg-cream px-4 py-3.5 text-[16px] text-cocoa placeholder:text-cocoa/40 focus:border-raspberry focus:outline-none focus:ring-2 focus:ring-raspberry/20";
  const label = "mb-1.5 block text-[13px] font-medium text-cocoa-soft";
  const section = "rounded-[28px] bg-blush/70 p-6 md:p-8";

  return (
    <>
      <div className="mb-10 flex items-start gap-3 rounded-2xl border border-raspberry/25 bg-raspberry/[0.06] px-5 py-4 text-[14px] text-cocoa" role="note">
        <Info className="mt-0.5 size-5 shrink-0 text-raspberry" aria-hidden />
        <p>
          <strong className="font-semibold">Demonstration checkout.</strong> No payment is taken and no order is sent to the shop. In the live
          version, payment is handled securely by Shopify.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <form onSubmit={onSubmit} className="order-2 space-y-6 lg:order-1" aria-label="Checkout">
          <h1 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-light leading-none">Checkout</h1>

          <fieldset className={section}>
            <legend className="font-display float-left mb-5 w-full text-[24px]">Contact</legend>
            <div className="clear-both grid gap-4">
              <div>
                <label htmlFor="email" className={label}>Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="phone" className={label}>Mobile number (for delivery tracking)</label>
                <input id="phone" name="phone" type="tel" required autoComplete="tel" className={field} placeholder="07…" pattern="[0-9+\(\)\s\-]{10,}"
                  title="A phone number, e.g. 07700 900123" />
              </div>
            </div>
          </fieldset>

          <fieldset className={section}>
            <legend className="font-display float-left mb-5 w-full text-[24px]">Delivery address</legend>
            <div className="clear-both grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={label}>First name</label>
                <input id="firstName" name="firstName" required autoComplete="given-name" className={field} />
              </div>
              <div>
                <label htmlFor="lastName" className={label}>Last name</label>
                <input id="lastName" name="lastName" required autoComplete="family-name" className={field} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address1" className={label}>Address</label>
                <input id="address1" name="address1" required autoComplete="address-line1" className={field} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address2" className={label}>Flat, suite, etc. (optional)</label>
                <input id="address2" name="address2" autoComplete="address-line2" className={field} />
              </div>
              <div>
                <label htmlFor="city" className={label}>Town or city</label>
                <input id="city" name="city" required autoComplete="address-level2" className={field} />
              </div>
              <div>
                <label htmlFor="postcode" className={label}>Postcode</label>
                <input
                  id="postcode"
                  name="postcode"
                  required
                  autoComplete="postal-code"
                  pattern={POSTCODE}
                  title="A UK postcode, e.g. BH10 5AB"
                  className={`${field} uppercase`}
                />
              </div>
              <p className="text-[13px] text-cocoa-soft sm:col-span-2">We deliver to UK addresses only.</p>
            </div>
          </fieldset>

          <fieldset className={section}>
            <legend className="font-display float-left mb-5 w-full text-[24px]">Delivery method</legend>
            <label className="clear-both flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-raspberry bg-cream p-4">
              <input type="radio" name="shipping" value="tracked24" defaultChecked className="mt-1 accent-raspberry" />
              <span className="flex-1">
                <span className="flex items-center gap-2 font-medium">
                  <Truck className="size-4 text-raspberry" aria-hidden /> Royal Mail Tracked 24
                </span>
                <span className="mt-1 block text-[14px] text-cocoa-soft">Aims for next-day delivery. Cost confirmed at payment.</span>
                <DispatchNote className="mt-2 text-[13px] text-raspberry" />
              </span>
            </label>
          </fieldset>

          <fieldset className={section}>
            <legend className="font-display float-left mb-5 w-full text-[24px]">Gift message (optional)</legend>
            <textarea
              name="giftMessage"
              rows={3}
              maxLength={250}
              className={`clear-both ${field} resize-none`}
              placeholder="Sending this as a gift? Add a note for the card."
            />
          </fieldset>

          <fieldset className={section}>
            <legend className="font-display float-left mb-5 w-full text-[24px]">Payment</legend>
            <div className="clear-both rounded-2xl border-2 border-dashed border-cocoa/20 bg-cream/60 p-6 text-center">
              <Lock className="mx-auto size-6 text-cocoa-soft" aria-hidden />
              <p className="mt-3 font-medium">Payment step skipped in this demo</p>
              <p className="mx-auto mt-1 max-w-[42ch] text-[14px] text-cocoa-soft">
                In the live shop this is Shopify&apos;s secure checkout: cards, Apple Pay, Google Pay and Shop Pay.
              </p>
            </div>
          </fieldset>

          <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 text-[14px] text-cocoa-soft hover:text-cocoa">
              <ArrowLeft className="size-4" aria-hidden /> Back to the shop
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-raspberry px-8 py-4 text-[16px] font-medium text-cream shadow-[0_10px_30px_-10px_rgba(179,36,90,0.7)] transition-all hover:-translate-y-0.5 hover:bg-raspberry-deep disabled:opacity-60"
            >
              {submitting ? "Placing order…" : `Place demo order · ${formatPrice(subtotal)}`}
            </button>
          </div>
        </form>

        {/* Summary */}
        <aside className="order-1 lg:order-2" aria-label="Order summary">
          <div className="rounded-[28px] bg-cocoa p-6 text-cream md:p-8 lg:sticky lg:top-28">
            <h2 className="font-display text-[24px] italic">
              Order summary <span className="text-[15px] not-italic text-cream/60">({count})</span>
            </h2>
            <ul className="mt-6 divide-y divide-cream/10">
              {items.map((i) => (
                <li key={i.slug} className="flex items-center gap-4 py-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-cream/10">
                    {i.image && <Image src={i.image} alt={i.imageAlt} fill sizes="64px" className="object-cover" />}
                    <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-rose text-[12px] font-semibold text-cocoa">
                      {i.qty}
                    </span>
                  </div>
                  <span className="flex-1 text-[15px]">{i.name}</span>
                  <span className="tabular-nums">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-cream/10 pt-4 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-cream/70">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cream/70">Delivery</dt>
                <dd className="text-cream/70">At payment</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-cream/10 pt-3">
                <dt>Total today</dt>
                <dd className="font-display text-[30px] tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
            </dl>
            {commerce.returnsPolicy && <p className="mt-6 text-[12px] leading-relaxed text-cream/50">{commerce.returnsPolicy}</p>}
          </div>
        </aside>
      </div>
    </>
  );
}
