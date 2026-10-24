import { defineQuery } from "next-sanity";

// Everything the one-page site needs, in a single round trip.
export const SITE_CONTENT_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    businessName,
    tagline,
    email,
    phone,
    address{ street, locality, postcode, country },
    shopOpened,
    allergenNotice,
    openingHours[]{ _key, day, opens, closes },
    ordering{ onlineShopUrl, mysteryBoxUrl, deliverooUrl, googleMapsUrl },
    social{ instagram, facebook, tiktok },
    googleRating{ value, reviewCount },
    hygieneRating{ value, inspected },
    seo{
      title,
      description,
      shareImage{ alt, hotspot, crop, asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }
    }
  },
  "home": *[_type == "homePage" && _id == "homePage"][0]{
    hero{
      eyebrow,
      heading{ statement, emphasis },
      intro,
      image{ alt, hotspot, crop, asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } },
      mobileImage{ alt, hotspot, crop, asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }
    },
    story{
      heading{ statement, emphasis },
      body,
      quote,
      quoteAttribution,
      milestones[]{ _key, when, what },
      image{ alt, hotspot, crop, asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } },
      secondaryImage{ alt, hotspot, crop, asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }
    },
    bakesSection{ heading{ statement, emphasis }, intro },
    mysteryBox{
      eyebrow,
      heading{ statement, emphasis },
      description,
      price,
      treatCount,
      shelfLife,
      deliveryNotes,
      image{ alt, hotspot, crop, asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }
    },
    celebrations{
      heading{ statement, emphasis },
      body,
      image{ alt, hotspot, crop, asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }
    },
    visit{ heading{ statement, emphasis }, note }
  },
  "bakes": *[_type == "bake" && defined(name)] | order(sortOrder asc, _createdAt asc){
    _id,
    name,
    description,
    image{ alt, hotspot, crop, asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }
  }
}`);
