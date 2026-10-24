"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/money";
import { LAST_ORDER_KEY, type DemoOrder } from "./CheckoutForm";

export function OrderConfirmation({ deliveryNote }: { deliveryNote: string }) {
  const [order, setOrder] = useState<DemoOrder | null | undefined>(undefined);

  useEffect(() => {
    const read = () => {
      try {
        const raw = window.sessionStorage.getItem(LAST_ORDER_KEY);
        setOrder(raw ? (JSON.parse(raw) as DemoOrder) : null);
      } catch {
        setOrder(null);
      }
    };
    read();
  }, []);

  if (order === undefined) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (!order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
        <h1 className="font-display text-[40px]">No recent order</h1>
        <Link href="/shop" className="rounded-full bg-cocoa px-6 py-3 text-[15px] font-medium text-cream hover:bg-raspberry">
          Go to the shop
        </Link>
      </div>
    );
  }

  const firstName = order.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-raspberry text-cream">
          <Check className="size-9" aria-hidden />
        </div>
        <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.22em] text-raspberry">Order {order.number}</p>
        <h1 className="font-display mt-4 text-[clamp(2.6rem,6vw,4.6rem)] font-light leading-[0.95] tracking-[-0.025em]">
          Thank you{firstName ? `, ${firstName}` : ""}. <em className="font-display-wonk text-raspberry">It&apos;s in the oven.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-[48ch] text-[17px] leading-relaxed text-cocoa/75">
          A confirmation would go to <strong className="font-medium text-cocoa">{order.email}</strong>. {deliveryNote}
        </p>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-raspberry/25 bg-raspberry/[0.06] px-5 py-4 text-[14px]" role="note">
        <Info className="mt-0.5 size-5 shrink-0 text-raspberry" aria-hidden />
        <p>This was a demonstration. No payment was taken and nothing was sent to the shop.</p>
      </div>

      <div className="mt-10 rounded-[28px] bg-blush/70 p-6 md:p-8">
        <ul className="divide-y divide-cocoa/10">
          {order.items.map((i) => (
            <li key={i.slug} className="flex items-center gap-4 py-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-blush">
                {i.image && <Image src={i.image} alt={i.imageAlt} fill sizes="64px" className="object-cover" />}
              </div>
              <span className="flex-1">
                {i.name} <span className="text-cocoa-soft">× {i.qty}</span>
              </span>
              <span className="tabular-nums">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t border-cocoa/10 pt-4">
          <span>Subtotal</span>
          <span className="font-display text-[28px] tabular-nums">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="mt-6 grid gap-6 border-t border-cocoa/10 pt-6 text-[15px] sm:grid-cols-2">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-cocoa-soft">Delivering to</p>
            <address className="mt-2 not-italic leading-relaxed">
              {order.name}
              {order.address.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
          </div>
          {order.giftMessage && (
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-cocoa-soft">Gift message</p>
              <p className="font-display mt-2 text-[18px] italic leading-snug">&ldquo;{order.giftMessage}&rdquo;</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-cocoa px-6 py-3.5 text-[15px] font-medium text-cream hover:bg-raspberry">
          Back to the shop <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href="/" className="inline-flex items-center rounded-full border border-cocoa/25 px-6 py-3.5 text-[15px] font-medium hover:border-cocoa">
          Home
        </Link>
      </div>
    </div>
  );
}
