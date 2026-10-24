import type { Product } from "./types";

/** Link to the enquiry form on the home page, pre-filled for a made-to-order product. */
export function enquiryHref(product: Pick<Product, "slug" | "name">) {
  const type = product.slug.includes("corporate") ? "Corporate gifting" : "Celebration cake";
  const params = new URLSearchParams({ enquiry: type, item: product.name });
  return `/?${params.toString()}#celebrations`;
}
