import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { OrderConfirmation } from "@/components/shop/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order confirmed — Twins Temptations",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage() {
  const { commerce } = await getSiteContent();
  return (
    <main id="main" className="px-5 pb-24 pt-32 md:px-10 md:pt-40">
      <OrderConfirmation deliveryNote={commerce.deliveryNotes[1] ?? commerce.deliveryNotes[0] ?? ""} />
    </main>
  );
}
