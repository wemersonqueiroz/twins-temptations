import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — Twins Temptations",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const { commerce } = await getSiteContent();
  return (
    <main id="main" className="px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto max-w-[1200px]">
        <CheckoutForm commerce={commerce} />
      </div>
    </main>
  );
}
