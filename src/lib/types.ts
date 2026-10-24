import type { PortableTextBlock } from "next-sanity";

export type Img = { src: string; alt: string; position?: string };
export type Heading = { statement: string; emphasis?: string };
export type DayHours = { day: string; open: string | null; close: string | null };

export type Business = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  phoneHref: string;
  address: { street: string; locality: string; postcode: string; country: string };
  shopUrl: string;
  mysteryBoxUrl: string;
  deliverooUrl: string;
  mapsUrl: string;
  mapsEmbed: string;
  social: { instagram: string; facebook: string; tiktok: string };
  googleRating: { value: number; count: number };
  hygieneRating: { value: number; inspected: string };
  openedShop: string;
  openedYear: string;
  allergenNotice: string;
  hours: DayHours[];
};

export type SiteContent = {
  business: Business;
  seo: { title: string; description: string; image: Img };
  hero: { eyebrow: string; heading: Heading; intro: string; image: Img; mobileImage: Img };
  story: {
    heading: Heading;
    body: PortableTextBlock[];
    quote: string;
    quoteAttribution: string;
    milestones: { key: string; when: string; what: string }[];
    image: Img;
    secondaryImage: Img;
  };
  bakesSection: { heading: Heading; intro: string };
  bakes: { key: string; name: string; note: string; image: Img }[];
  mysteryBox: {
    eyebrow: string;
    heading: Heading;
    description: string;
    price: string;
    treatCount: number;
    shelfLife: string;
    deliveryNotes: string[];
    image: Img;
  };
  celebrations: { heading: Heading; body: string; image: Img };
  visit: { heading: Heading; note: string };
};
