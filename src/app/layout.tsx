import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { SanityLive } from "@/sanity/live";
import { expireSanityTags } from "@/sanity/actions";
import { getSiteContent } from "@/lib/content";
import { siteUrl } from "@/lib/fallback";
import type { SiteContent } from "@/lib/types";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo, business } = await getSiteContent();
  const image = { url: seo.image.src, width: 1200, height: 630, alt: seo.image.alt };
  return {
    metadataBase: new URL(siteUrl),
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: "/",
      siteName: business.name,
      title: seo.title,
      description: seo.description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [seo.image.src] },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbe3e6",
};

function bakeryJsonLd({ business, seo }: SiteContent) {
  const open = business.hours.filter((h) => h.open && h.close);
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: business.name,
    url: siteUrl,
    image: seo.image.src.startsWith("http") ? seo.image.src : `${siteUrl}${seo.image.src}`,
    email: business.email,
    telephone: business.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      postalCode: business.address.postcode,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: open.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: h.open,
      closes: h.close,
    })),
    servesCuisine: "Cakes and baked goods",
    sameAs: Object.values(business.social),
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bakeryJsonLd(content)).replace(/</g, "\\u003c") }}
        />
        {children}
        <SanityLive action={expireSanityTags} />
      </body>
    </html>
  );
}
