# Owner admin: one-time setup (developer)

The owner edits products at `/admin` (Decap CMS). Logins go through GitHub. Each save commits to this repository, and Vercel rebuilds the site.

## 1. Who can edit

Only GitHub accounts with **write access** to `namaswa27/Empire_website` can publish. The login cannot grant more access than the account already has. For this site, add only the owner\x27s GitHub account as a collaborator, and keep the repository private if the source should not be public.

## 2. Create a GitHub OAuth App

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App:

- Application name: Empire Beauty Space admin
- Homepage URL: `https://YOUR-SITE-DOMAIN`
- Authorization callback URL: `https://YOUR-SITE-DOMAIN/api/callback`

Copy the **Client ID** and generate a **Client secret**.

## 3. Set the Vercel environment variables

Project → Settings → Environment Variables (Production, and Preview if you want it):

| Name | Value |
|---|---|
| `GITHUB_OAUTH_CLIENT_ID` | Client ID from step 2 |
| `GITHUB_OAUTH_CLIENT_SECRET` | Client secret from step 2 (keep it secret) |
| `SITE_ORIGIN` | `https://YOUR-SITE-DOMAIN` (no trailing slash) |

See `.env.example` for local development.

## 4. Point the admin at the live domain

In `public/admin/config.yml`, replace `YOUR-SITE-DOMAIN` in `backend.base_url` with the same origin as `SITE_ORIGIN`. Commit and deploy.

## 5. Check it works

1. Open `https://YOUR-SITE-DOMAIN/admin/`.
2. Click **Login with GitHub** and authorise the app.
3. Create a test product, add one photo, and publish.
4. Wait for the Vercel build, then check the product page. Delete the test product afterwards.

## Notes

- Vercel build command (already in `vercel.json`): `npm run images:products || true; npm run build`. Rejected photos are written to the build log, and the build still succeeds.
- Decap is pinned to `decap-cms@3.16.3` in `public/admin/index.html`. Upgrade deliberately, and test login afterwards.
- Login tokens are held by the browser only for the admin session. The callback page sends the token only to `SITE_ORIGIN` and sets `Cache-Control: no-store`.
- The state cookie protects against forged logins. It is single-use and expires after 10 minutes.
