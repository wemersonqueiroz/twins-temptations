"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/money";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./QtyStepper";

type Props = {
  product: Pick<Product, "slug" | "name" | "price" | "available" | "maxPerOrder" | "shopifyVariantId" | "images">;
  /** "dark" for use on the cocoa Mystery Box section */
  tone?: "light" | "dark";
  showQty?: boolean;
};

export function AddToCart({ product, tone = "light", showQty = true }: Props) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  if (product.price == null) return null;
  const price = product.price;

  if (!product.available) {
    return (
      <button type="button" disabled className="rounded-full bg-cocoa/15 px-8 py-4 text-[15px] font-medium text-cocoa/60">
        Sold out
      </button>
    );
  }

  const button =
    tone === "dark"
      ? "bg-rose text-cocoa hover:bg-cream"
      : "bg-raspberry text-cream shadow-[0_10px_30px_-10px_rgba(179,36,90,0.7)] hover:bg-raspberry-deep";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showQty && (
        <div className={tone === "dark" ? "[&>div]:border-cream/25 [&>div]:bg-transparent [&>div]:text-cream [&_button:hover]:bg-cream/10" : ""}>
          <QtyStepper value={qty} max={product.maxPerOrder} onChange={(n) => setQty(Math.max(1, n))} label={`Quantity of ${product.name}`} />
        </div>
      )}
      <button
        type="button"
        onClick={() =>
          add(
            {
              slug: product.slug,
              name: product.name,
              price,
              image: product.images[0]?.src ?? "",
              imageAlt: product.images[0]?.alt ?? product.name,
              variantId: product.shopifyVariantId,
              max: product.maxPerOrder,
            },
            qty,
          )
        }
        className={`group inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-medium transition-all hover:-translate-y-0.5 ${button}`}
      >
        <ShoppingBag className="size-4" aria-hidden />
        Add to cart · {formatPrice(price * qty)}
      </button>
    </div>
  );
}
