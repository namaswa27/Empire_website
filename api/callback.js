/** GitHub redirects here after login. Exchanges the code for a token and hands it to the admin popup. */
import { oauthConfig, parseCookies, safeEqual, resultPage, STATE_COOKIE } from "../server/oauth.js";

function send(res, status, html) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'unsafe-inline'");
  res.end(html);
}

export default async function handler(req, res) {
  const config = oauthConfig();
  if (!config) return send(res, 500, "Admin login is not configured yet.");

  // The state cookie is single-use: clear it on every attempt.
  res.setHeader("Set-Cookie", `${STATE_COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);

  const { code, state, error } = req.query || {};
  const expected = parseCookies(req.headers?.cookie)[STATE_COOKIE];
  if (error || !code || !state || !expected || !safeEqual(state, expected)) {
    return send(res, 400, resultPage(config.siteOrigin, "error", { message: "Login could not be verified. Please try again." }));
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: `${config.siteOrigin}/api/callback`,
      }),
    });
    const body = await tokenResponse.json();
    if (!tokenResponse.ok || !body.access_token) {
      return send(res, 502, resultPage(config.siteOrigin, "error", { message: "GitHub did not accept the login. Please try again." }));
    }
    return send(res, 200, resultPage(config.siteOrigin, "success", { token: body.access_token, provider: "github" }));
  } catch {
    return send(res, 502, resultPage(config.siteOrigin, "error", { message: "Could not reach GitHub. Please try again." }));
  }
}
