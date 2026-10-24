"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { count, open, ready } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      className="relative grid size-11 place-items-center rounded-full text-cocoa transition-colors hover:bg-blush"
      aria-label={ready && count > 0 ? `Open cart, ${count} item${count === 1 ? "" : "s"}` : "Open cart"}
    >
      <ShoppingBag className="size-[22px]" aria-hidden />
      {ready && count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-raspberry px-1 text-[11px] font-semibold leading-5 text-cream">
          {count}
        </span>
      )}
    </button>
  );
}
