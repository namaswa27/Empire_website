# Content Management Guide — Empire Beauty Space

This site is a **frontend-only** React + TypeScript app. There is no
backend, no database, and no admin dashboard. Everything a visitor
sees — services, products, categories, gallery photos, testimonials,
FAQs, and business details — comes from plain TypeScript files in
`src/data/`. To change what's on the site, you edit one of those
files and redeploy. Nothing else needs to change.

If you can edit a spreadsheet or a simple text file, you can maintain
this catalogue — the syntax below is the only "code" involved, and
each example can be copy-pasted and adjusted.

## Where everything lives

| File | Controls |
|---|---|
| `src/data/business.ts` | Business name, phone, WhatsApp, address, social handles, hours, about/mission/vision |
| `src/data/categories.ts` | Service categories and product categories |
| `src/data/services.ts` | Every service (the Services page, homepage "Featured Services", and the appointment form's dropdown all read from this file) |
| `src/data/products.ts` | Every product (the Products page and homepage "Featured Products" read from this file) |
| `src/data/gallery.ts` | Gallery photos |
| `src/data/testimonials.ts` | Client testimonials |
| `src/data/faqs.ts` | FAQ entries shown on the Contact page |

Images referenced from these files should be placed in `public/images/`
(create subfolders like `public/images/services/` or
`public/images/products/` if that helps you stay organized) and
referenced with a path starting `/images/...`.

After editing any file in `src/data/`, run `npm run build` (see
**Deploying changes** below) to publish the update — editing the file
alone does not change the live site until it's rebuilt and redeployed.

---

## Add a service

Open `src/data/services.ts` and add an entry to the `services` array:

```ts
{
  id: "svc-deep-cleansing-facial",     // unique, no spaces
  name: "Deep Cleansing Facial",
  slug: "deep-cleansing-facial",       // unique, used in the URL /services/<slug>
  categoryId: "svc-facial",            // must match an id in categories.ts
  shortDescription: "A refreshing deep-clean facial for all skin types.",
  description: "Full description shown on the service's own page.",
  duration: "60 minutes",
  price: 2500,                         // number in KSh, or omit for "price on request"
  priceDisplayMode: "fixed",           // "fixed" | "from" | "on_request"
  image: "/images/services/deep-cleansing-facial.jpg",
  benefits: ["Unclogs pores", "Brightens skin"],
  preparation: "Arrive with a clean face, no makeup.",
  aftercare: "Avoid direct sun exposure for 24 hours.",
  featured: true,                      // shows in homepage "Featured Services"
  active: true,                        // false hides it from the site without deleting it
  bookingAvailable: true,              // false hides the "Book Appointment" button
},
```

Every field except `id`, `name`, `slug`, and `categoryId` is optional
— leave out anything not yet confirmed rather than inventing a value.

## Edit a service

Find the entry in `src/data/services.ts` by its `name` or `slug` and
change whichever fields need updating.

## Remove / hide a service

- To hide it from the site but keep the data (e.g. seasonal or
  temporarily paused): set `active: false`.
- To delete it permanently: delete the whole `{ ... }` entry from the
  array.

## Feature / unfeature a service

Set `featured: true` or `featured: false`. Featured services appear
in the homepage "Featured Services" section.

---

## Add / edit / remove a product

Same pattern in `src/data/products.ts`:

```ts
{
  id: "prod-hydrating-body-lotion",
  name: "Hydrating Body Lotion",
  slug: "hydrating-body-lotion",
  brand: "Empire Care",
  categoryId: "prod-bodycare",         // must match an id in categories.ts
  shortDescription: "Lightweight daily hydration.",
  description: "Full description shown on the product's own page.",
  price: 1200,                         // number in KSh, or omit for "enquire for price"
  priceDisplayMode: "fixed",
  size: "250ml",
  image: "/images/products/hydrating-body-lotion.jpg",
  benefits: ["24h hydration", "Non-greasy"],
  ingredients: "Aqua, Glycerin, ...",
  usageInstructions: "Apply after shower.",
  suitableFor: "All skin types",
  featured: true,
  active: true,
},
```

Products never show a "Buy" or "Add to Cart" button — every product
page shows an "Enquire" action instead, which opens a WhatsApp
message (or email, if no WhatsApp number is set) addressed to Empire
Beauty Space with the product name pre-filled.

---

## Change a product/service image

1. Add the image file to `public/images/services/` or
   `public/images/products/`.
2. Set that entry's `image` field to `/images/services/your-file.jpg`
   (or `/images/products/...`).

Keep images reasonably sized (under ~500KB) for fast page loads —
compress them before adding, e.g. with [Squoosh](https://squoosh.app).

## Change prices

Edit the `price` and `priceDisplayMode` field on the service or
product:

- `price: 2500, priceDisplayMode: "fixed"` → shows "KSh 2,500"
- `price: 2500, priceDisplayMode: "from"` → shows "From KSh 2,500"
- `priceDisplayMode: "on_request"` (and omit `price`) → shows "Price on request"

## Add / edit / remove a category

Open `src/data/categories.ts`. `serviceCategories` and
`productCategories` are separate lists:

```ts
{ id: "svc-nails", name: "Nail Care", slug: "nail-care" },
```

The `id` you choose here is what services/products reference in
their own `categoryId` field — if you rename a category, its `id` can
stay the same (only `name` needs to change, and existing
services/products keep working). If you remove a category, make sure
no service/product still references its `id` first, or that item
will show as "Uncategorized".

---

## Update business contact details

Everything — phone number, WhatsApp, address, Instagram/TikTok
handles, business hours, about/mission/vision text — lives in
`src/data/business.ts`. Every "Call Us", "WhatsApp Us", "Get
Directions", etc. button across the whole site is generated from this
one file, so you only ever need to update it in one place.

To set business hours once confirmed, uncomment and fill in the
`businessHours` example in that file.

---

## Deploying changes

This is a static site — after editing `src/data/*`, build it and
publish the `dist/` folder:

```bash
npm install       # first time only, or after package.json changes
npm run build      # produces a dist/ folder
npm run preview    # optional: preview the production build locally
```

Upload/deploy the contents of `dist/` to your static host (Netlify,
Vercel, GitHub Pages, etc.). A `public/_redirects` (Netlify) and
`vercel.json` (Vercel) are already included so client-side routing
(`/services/some-service`, etc.) works correctly on those hosts.

**GitHub Pages** needs one extra step because it doesn't support SPA
routing out of the box: either serve the app under a `HashRouter`
instead of `BrowserRouter` (ask a developer to make this one-line
swap in `src/main.tsx`), or follow the common
["spa-github-pages" 404.html redirect trick](https://github.com/rafgraph/spa-github-pages).

Before going live, also replace `REPLACE_WITH_PRODUCTION_DOMAIN` in
`public/robots.txt` and `public/sitemap.xml` with the real domain.

---

## A note on the "no fake content" rule

Every list in `src/data/` (services, products, gallery, testimonials,
FAQs) intentionally starts **empty**. The site shows an honest
"coming soon" message instead of inventing services, prices, photos,
or reviews. Please keep it that way — only add entries here once
they reflect what Empire Beauty Space actually offers.
