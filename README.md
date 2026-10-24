# Twins Temptations — site + Sanity

Next.js 16 site whose content is edited in the Sanity Studio next door
(`../studio-twinstemptations`, project `i02j10kl`, dataset `production`).

## Run locally

```bash
# terminal 1 — the site (http://localhost:3000)
cd twins-temptations-cms
npm run dev

# terminal 2 — the Studio (http://localhost:3333)
cd studio-twinstemptations
npm run dev
```

Copy `.env.example` to `.env.local` first if it doesn't exist.

## What's editable

| In the Studio | On the site |
|---|---|
| **Home page** | Hero, story, bakes intro, Mystery Box, celebrations, visit texts and images |
| **Site settings** | Contact, address, opening hours, links, ratings, SEO and share image |
| **Bakes** | The list under "The bakes", ordered by *Sort order* |
| **Shop products** | `/shop` and `/shop/[slug]`: buy online (cart) or made to order (enquiry) |

Any empty field falls back to the built-in content in `src/lib/fallback.ts`,
so the site never renders blank.

## How updates reach the site

- **Live:** `<SanityLive />` listens for published changes and refreshes open pages within seconds.
- **Safety net:** the cached page refreshes every 5 minutes, even with nobody on the site.
- **Instant (production):** a Sanity webhook calls `/api/revalidate`.

### Webhook setup (after deploying)

1. Generate a secret and set `SANITY_REVALIDATE_SECRET` in your hosting environment.
2. In [sanity.io/manage](https://www.sanity.io/manage) → project → **API → Webhooks → Create**:
   - URL: `https://<your-domain>/api/revalidate`
   - Dataset: `production`, Trigger on: create, update, delete
   - Filter: `_type in ["siteSettings", "homePage", "bake", "product"]`
   - Secret: the same value as `SANITY_REVALIDATE_SECRET`
3. Add the production URL to CORS: `cd studio-twinstemptations && npx sanity cors add https://<your-domain> --credentials`

## Types

After changing the schema or the GROQ query in `src/sanity/queries.ts`:

```bash
cd studio-twinstemptations
npm run typegen        # writes ../twins-temptations-cms/sanity.types.ts
npx sanity schemas deploy
```

## Shop & checkout

- Cart lives in the browser (localStorage); the drawer opens from the bag icon.
- **Site settings → Shop & checkout → Checkout mode**
  - **Demo** (default): full checkout at `/checkout`, no payment taken, clearly labelled.
  - **Shopify**: the cart button sends shoppers to the Shopify checkout using a cart permalink
    (`<store>/cart/<variantId>:<qty>,…`). Every product needs its *Shopify variant ID*
    (find it in `<store>/products.json`). No API keys needed.
- A deeper integration (Shopify Storefront API, live stock and prices from Shopify) is the next step if needed.
