/**
 * Shared helpers for the GitHub login used by the owner admin (Decap CMS).
 * Lives outside api/ so Vercel does not deploy it as a route.
 */
import crypto from "node:crypto";

export const STATE_COOKIE = "decap_oauth_state";

export function oauthConfig() {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const siteOrigin = (process.env.SITE_ORIGIN || "").replace(/\/+$/, "");
  if (!clientId || !clientSecret || !/^https:\/\/[^/]+$/.test(siteOrigin)) return null;
  return { clientId, clientSecret, siteOrigin };
}

export function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([k, v]) => k && v !== undefined)
      .map(([k, ...rest]) => [k, rest.join("=")])
  );
}

export function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/**
 * Builds the page that talks to the Decap popup. It follows Decap's
 * handshake: announce "authorizing:github", wait for the echo from the
 * admin window, then send the result. Messages only go to SITE_ORIGIN.
 */
export function resultPage(siteOrigin, outcome, payload) {
  const message = `authorization:github:${outcome}:${JSON.stringify(payload)}`;
  const safe = (value) =>
    JSON.stringify(value)
      .replace(new RegExp("<", "g"), "\\u003c")
      .replace(new RegExp("\\u2028", "g"), "\\u2028")
      .replace(new RegExp("\\u2029", "g"), "\\u2029");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Signing in…</title></head>
<body><p>Signing you in…</p>
<script>
(function () {
  var target = ${safe(siteOrigin)};
  var result = ${safe(message)};
  function onMessage(event) {
    if (event.origin !== target) return;
    if (event.data === "authorizing:github") {
      window.removeEventListener("message", onMessage, false);
      window.opener && window.opener.postMessage(result, target);
    }
  }
  window.addEventListener("message", onMessage, false);
  window.opener && window.opener.postMessage("authorizing:github", target);
})();
</script></body></html>`;
}
