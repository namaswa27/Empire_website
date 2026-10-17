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
| `content/products/*.json` | Every product, one file each. Edit them in the admin at `/admin` (see **Products and photos in the admin**) |
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

## Products and photos in the admin

Products are managed at **`/admin`** on the live website. Log in with the GitHub account that has access to the repository.

**Add a product:** open **Products → New Products**, fill in the form, and click **Publish**. Then upload its photos (below).

**Edit a product:** open **Products**, click the product, change the fields, and click **Publish**.

**Hide a product** without deleting it: switch off **Visible on the website**.

**Delete a product:** open it and use the delete option in the top bar. Its photos are removed from the site on the next publish.

**Prices:** enter the price in KSh. Use **Price display** for "Fixed price", "From price" or "Price on request". Leave the price empty for "on request".

**Categories** come from a fixed list in the form. New categories need a developer.

Products never show a "Buy" or "Add to Cart" button; every product offers an "Enquire" action instead.

After you publish, the website rebuilds automatically. This usually takes 1–3 minutes.

## Product photos in the admin

1. Open the product in **/admin**.
2. In the **Photos** field, click **Choose an image**. This opens the media library.
3. Upload the photos for that product. They are saved to the product's own folder automatically.
4. Name files so they show in the order you want: `01-front.jpg`, `02-side.jpg`, `03-label.png`. The first photo is the main photo on product cards.
5. Click **Publish**.

To remove a photo, open the library from the same field, select the photo, and delete it. Then publish again.

Photos must be JPEG, PNG or WebP, and up to 5 MB each. Files that are too large or the wrong type are rejected. The website keeps the photos it already has if a new upload fails. A rejected photo is reported in the build log, which a developer can check. Your other photos still publish.

Hidden photo information such as location data is removed automatically.

**For developers:** photos are processed by `npm run images:products`, which runs before each build on Vercel. You can also run it locally after adding photos to `product-photos/<slug>/`.

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
