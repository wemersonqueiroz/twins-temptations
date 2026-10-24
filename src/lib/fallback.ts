import type { SiteContent } from "./types";

// Built-in content. Shown for any field that is empty in Sanity, or if Sanity
// can't be reached, so the site never renders blank.

const block = (key: string, text: string) => ({
  _type: "block" as const,
  _key: key,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span" as const, _key: `${key}s`, text, marks: [] }],
});

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://twinstemptations.co.uk";

export const fallback: SiteContent = {
  business: {
    name: "Twins Temptations",
    tagline: "Buttercream cakes & sweet treats",
    email: "twinstemptations@hotmail.co.uk",
    phone: "07713 905175",
    phoneHref: "tel:+447713905175",
    address: { street: "83 Coombe Avenue", locality: "Bournemouth", postcode: "BH10 5AB", country: "GB" },
    shopUrl: "https://twinstemptations.co.uk",
    mysteryBoxUrl: "https://twinstemptations.co.uk/products/mystery-box",
    deliverooUrl: "https://deliveroo.co.uk/menu/bournemouth/northbourne/twins-temptations-5-pengelly-avenue",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Twins+Temptations+83+Coombe+Ave+Bournemouth+BH10+5AB",
    mapsEmbed:
      "https://maps.google.com/maps?q=Twins%20Temptations%2C%2083%20Coombe%20Ave%2C%20Bournemouth%20BH10%205AB&z=16&output=embed",
    social: {
      instagram: "https://www.instagram.com/twinstemptations/",
      facebook: "https://www.facebook.com/twinstemptations/",
      tiktok: "https://www.tiktok.com/@twinstemptations",
    },
    googleRating: { value: 5, count: 24 },
    hygieneRating: { value: 5, inspected: "April 2025" },
    openedShop: "March 2025",
    openedYear: "2025",
    allergenNotice:
      "Made in a kitchen that handles all allergens, including nuts. Allergen information comes with every order under Natasha's Law. Get in touch before ordering if you have an allergy.",
    hours: [
      { day: "Monday", open: null, close: null },
      { day: "Tuesday", open: "10:00", close: "16:00" },
      { day: "Wednesday", open: "10:00", close: "16:00" },
      { day: "Thursday", open: "10:00", close: "16:00" },
      { day: "Friday", open: "10:00", close: "16:00" },
      { day: "Saturday", open: null, close: null },
      { day: "Sunday", open: null, close: null },
    ],
  },
  commerce: {
    checkoutMode: "demo",
    shopifyStoreUrl: "https://twinstemptations.co.uk",
    deliveryNotes: [
      "Order before 11:30am, Tuesday to Friday, and it usually goes out the same day.",
      "Sent Royal Mail Tracked 24, aiming for next-day delivery (not guaranteed).",
      "No dispatch on Saturdays, Sundays, Mondays or bank holidays.",
    ],
    returnsPolicy:
      "Everything is freshly baked and perishable, so all sales are final and we can't offer returns, exchanges or refunds. If something is wrong with your order, email us within 24 hours of delivery.",
  },
  seo: {
    title: "Twins Temptations — Buttercream Cakes & Sweet Treats, Bournemouth",
    description:
      "Handmade buttercream cakes, brownies, blondies, cookie pies and more from the pink shop on Coombe Avenue, Bournemouth. Open Tuesday–Friday, 10am–4pm, with Mystery Boxes posted nationwide.",
    image: { src: "/images/og.jpg", alt: "A pink buttercream celebration cake on a cake stand" },
  },
  hero: {
    eyebrow: "The pink shop · Bournemouth",
    heading: { statement: "Baked by two.", emphasis: "Made to share." },
    intro:
      "Buttercream cakes and seriously good sweet treats, handmade fresh by the twins on Coombe Avenue, and posted to your door.",
    image: {
      src: "/images/hero.jpg",
      alt: "A tall pink buttercream celebration cake with piped rosettes, raspberries and flowers on a white cake stand",
      position: "70% 50%",
    },
    mobileImage: {
      src: "/images/herom.jpg",
      alt: "A tall pink buttercream celebration cake with raspberries and flowers on a white cake stand",
      position: "50% 100%",
    },
  },
  story: {
    heading: { statement: "Almost ten years", emphasis: "in the baking." },
    body: [
      block(
        "p1",
        "The twins started out as home bakers, making cakes for friends, family and anyone who would let them bring cake round. The hobby turned into a passion, and word started to spread.",
      ),
      block(
        "p2",
        "In March 2025 they finally took the leap and opened their own shop on Coombe Avenue. It's pink from floor to ceiling. Everything is still fresh, handmade and baked with the same care as in that first home kitchen.",
      ),
    ],
    quote: "Creating treats that make people smile the second they open the box.",
    quoteAttribution: "The twins",
    milestones: [
      { key: "m1", when: "Then", what: "Home bakers" },
      { key: "m2", when: "Soon", what: "Word spread" },
      { key: "m3", when: "March 2025", what: "The pink shop opens" },
    ],
    image: {
      src: "/images/floral.jpg",
      alt: "Pink buttercream cupcakes under a glass dome in front of a wall of pink and white flowers",
    },
    secondaryImage: { src: "/images/school.jpg", alt: "Squares of iced school cake with rainbow sprinkles" },
  },
  bakesSection: {
    heading: { statement: "The bakes people", emphasis: "queue for." },
    intro: "The counter changes daily. Follow @twinstemptations to see what's fresh today.",
  },
  bakes: [
    { key: "b1", name: "Brownies", note: "Thick, fudgy, the reason people come back.", image: { src: "/images/bakes.jpg", alt: "A stack of fudgy brownies" } },
    { key: "b2", name: "Blondies", note: "The golden, caramel-y sibling.", image: { src: "/images/box.jpg", alt: "A blondie in a pink gift box" } },
    { key: "b3", name: "School cake", note: "Sponge, thick icing, sprinkles. Pure nostalgia.", image: { src: "/images/school.jpg", alt: "Iced school cake with sprinkles" } },
    { key: "b4", name: "Cookie pies", note: "Half cookie, half pie, fully gooey.", image: { src: "/images/cookies.jpg", alt: "A gooey cookie pie slice" } },
    { key: "b5", name: "Millionaires", note: "Shortbread, caramel, chocolate. Layered properly.", image: { src: "/images/bakes.jpg", alt: "Millionaire shortbread squares" } },
    { key: "b6", name: "Cookies", note: "Big, soft-centred, generously chipped.", image: { src: "/images/cookies.jpg", alt: "Chocolate chip cookies" } },
    { key: "b7", name: "Buttercream cakes", note: "Decorated cakes for every occasion.", image: { src: "/images/twins.jpg", alt: "Two buttercream celebration cakes" } },
  ],
  mysteryBox: {
    eyebrow: "Posted nationwide",
    heading: { statement: "The", emphasis: "Mystery Box." },
    description:
      "Four of the twins' favourite treats, chosen from the best-sellers. It could be brownies, blondies, school cake, cookie pies, millionaires or cookies. You won't know until you open the lid.",
    price: "£20",
    treatCount: 4,
    shelfLife: "7+",
    deliveryNotes: [
      "Order before 11:30am, Tuesday to Friday, and it usually goes out the same day.",
      "Sent Royal Mail Tracked 24, aiming for next-day delivery.",
    ],
    image: {
      src: "/images/box.jpg",
      alt: "An open pink gift box holding a brownie, a blondie, a cookie pie slice and a millionaire shortbread",
    },
  },
  celebrations: {
    heading: { statement: "Two bakers.", emphasis: "Every occasion." },
    body: "Decorated buttercream cakes for birthdays and the big moments, plus treat packages for corporate gifts and events, for every budget and idea. Tell the twins what you have in mind.",
    image: {
      src: "/images/twins.jpg",
      alt: "Two matching buttercream cakes with pink rosettes and sprinkles side by side on white cake stands",
    },
  },
  visit: {
    heading: { statement: "Come and say", emphasis: "hello." },
    note: "Watch our socials for pop-ups and holiday changes.",
  },
};
