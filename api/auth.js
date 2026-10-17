/** Starts GitHub login for the owner admin. Route: /api/auth?provider=github */
import crypto from "node:crypto";
import { oauthConfig, STATE_COOKIE } from "../server/oauth.js";

const ALLOWED_SCOPES = new Set(["repo", "public_repo"]);

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("Method not allowed");
  }
  const config = oauthConfig();
  if (!config) {
    res.statusCode = 500;
    return res.end("Admin login is not configured yet.");
  }
  if (req.query?.provider !== "github") {
    res.statusCode = 400;
    return res.end("Unsupported login provider.");
  }

  const requestedScope = String(req.query?.scope || "repo");
  const scope = ALLOWED_SCOPES.has(requestedScope) ? requestedScope : "repo";
  const state = crypto.randomBytes(24).toString("hex");

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", config.clientId);
  authorize.searchParams.set("redirect_uri", `${config.siteOrigin}/api/callback`);
  authorize.searchParams.set("scope", scope);
  authorize.searchParams.set("state", state);

  res.setHeader("Set-Cookie", `${STATE_COOKIE}=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.statusCode = 302;
  res.setHeader("Location", authorize.toString());
  res.end();
}
