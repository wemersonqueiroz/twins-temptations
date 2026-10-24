"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Commerce } from "@/lib/types";
import { formatPrice } from "@/lib/money";
import { shopifyCheckoutUrl, useCart } from "./CartProvider";
import { QtyStepper } from "./QtyStepper";

export function CartDrawer({ commerce }: { commerce: Commerce }) {
  const { items, subtotal, count, isOpen, close, setQty, remove } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [isOpen, close]);

  const shopifyUrl = commerce.checkoutMode === "shopify" ? shopifyCheckoutUrl(commerce.shopifyStoreUrl, items) : null;
  const shopifyBlocked = commerce.checkoutMode === "shopify" && items.length > 0 && !shopifyUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-cocoa/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-cream shadow-[-30px_0_60px_-30px_rgba(53,25,26,0.4)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <header className="flex items-center justify-between border-b border-cocoa/10 px-6 py-5">
              <h2 id="cart-title" className="font-display text-[26px] italic">
                Your box {count > 0 && <span className="text-[16px] not-italic text-cocoa-soft">({count})</span>}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="grid size-10 place-items-center rounded-full hover:bg-blush"
                aria-label="Close cart"
              >
                <X className="size-5" aria-hidden />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="grid size-20 place-items-center rounded-full bg-blush text-raspberry">
                  <ShoppingBag className="size-8" aria-hidden />
                </div>
                <p className="font-display text-[24px]">Your box is empty.</p>
                <p className="text-[15px] text-cocoa-soft">Nothing a Mystery Box can&apos;t fix.</p>
                <Link
                  href="/shop"
                  onClick={close}
                  className="inline-flex items-center gap-2 rounded-full bg-cocoa px-6 py-3 text-[14px] font-medium text-cream hover:bg-raspberry"
                >
                  Browse the shop <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-cocoa/10 overflow-y-auto px-6">
                  {items.map((item) => (
                    <li key={item.slug} className="flex gap-4 py-5">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={close}
                        className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-blush"
                      >
                        {item.image && <Image src={item.image} alt={item.imageAlt} fill sizes="96px" className="object-cover" />}
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <Link href={`/shop/${item.slug}`} onClick={close} className="font-display text-[19px] leading-tight hover:text-raspberry">
                            {item.name}
                          </Link>
                          <span className="text-[15px] font-medium tabular-nums">{formatPrice(item.price * item.qty)}</span>
                        </div>
                        <span className="mt-1 text-[13px] text-cocoa-soft">{formatPrice(item.price)} each</span>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <QtyStepper size="sm" value={item.qty} max={item.max} onChange={(n) => setQty(item.slug, n)} label={`Quantity of ${item.name}`} />
                          <button
                            type="button"
                            onClick={() => remove(item.slug)}
                            className="grid size-9 place-items-center rounded-full text-cocoa-soft hover:bg-blush hover:text-raspberry"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-cocoa/10 bg-blush/60 px-6 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[15px]">Subtotal</span>
                    <span className="font-display text-[26px] tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 flex items-start gap-2 text-[13px] text-cocoa-soft">
                    <Truck className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {commerce.deliveryNotes[0] ?? "Delivery is calculated at checkout."}
                  </p>

                  {shopifyUrl ? (
                    <a
                      href={shopifyUrl}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-raspberry px-6 py-4 text-[15px] font-medium text-cream hover:bg-raspberry-deep"
                    >
                      Checkout securely <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                  ) : shopifyBlocked ? (
                    <p className="mt-5 rounded-2xl bg-cream px-4 py-3 text-[13px] text-cocoa-soft">
                      Online checkout isn&apos;t available for one of these items yet. Please get in touch to order.
                    </p>
                  ) : (
                    <Link
                      href="/checkout"
                      onClick={close}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-raspberry px-6 py-4 text-[15px] font-medium text-cream hover:bg-raspberry-deep"
                    >
                      Checkout <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  )}
                  <button type="button" onClick={close} className="mt-3 w-full text-center text-[14px] text-cocoa-soft underline-offset-4 hover:underline">
                    Keep shopping
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
