import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Business } from "@/lib/types";
import { openDaysSummary } from "@/lib/hours";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./icons";

export function SiteFooter({ business }: { business: Business }) {
  return (
    <footer className="relative overflow-hidden bg-cocoa px-5 pb-10 pt-20 text-cream md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-[26px] italic">Pop in, order in, or post it.</p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose px-6 py-3 text-[14px] font-medium text-cocoa hover:bg-cream"
            >
              Visit the shop <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="text-[15px] leading-relaxed text-cream/75">
            <p className="mb-3 text-[12px] uppercase tracking-[0.22em] text-rose">Find us</p>
            <a href={business.mapsUrl} target="_blank" rel="noopener" className="hover:text-cream">
              {business.address.street}, {business.address.locality} {business.address.postcode}
            </a>
            <br />
            {openDaysSummary(business.hours)}
            <br />
            <a href={business.phoneHref} className="hover:text-cream">{business.phone}</a>
          </div>
          <div>
            <p className="mb-3 text-[12px] uppercase tracking-[0.22em] text-rose">Follow the bakes</p>
            <div className="flex gap-3">
              {[
                { href: business.social.instagram, label: "Instagram", Icon: InstagramIcon },
                { href: business.social.facebook, label: "Facebook", Icon: FacebookIcon },
                { href: business.social.tiktok, label: "TikTok", Icon: TikTokIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${business.name} on ${label}`}
                  className="grid size-12 place-items-center rounded-full border border-cream/20 transition-colors hover:border-rose hover:bg-rose hover:text-cocoa"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <p
          className="font-display pointer-events-none mt-20 select-none whitespace-nowrap text-center text-[clamp(3rem,13vw,13rem)] font-light italic leading-none tracking-[-0.04em] text-cream/[0.08]"
          aria-hidden
        >
          {business.name}
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-cream/10 pt-6 text-[12px] text-cream/50 md:flex-row md:justify-between">
          <p>© {business.name}. All bakes handmade in {business.address.locality}.</p>
          <p className="max-w-[62ch] md:text-right">
            Our kitchen handles all allergens, including nuts. Photography on this site is AI-generated illustration.
            See our Instagram for the real bakes.
          </p>
        </div>
      </div>
    </footer>
  );
}
