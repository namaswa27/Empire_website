/** Tests for the owner-admin GitHub login functions. Run with: npm run test:admin */
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import authHandler from "../api/auth.js";
import callbackHandler from "../api/callback.js";

const realFetch = globalThis.fetch;

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(body = "") { this.body = body; return this; },
  };
}

beforeEach(() => {
  process.env.GITHUB_OAUTH_CLIENT_ID = "test-client-id";
  process.env.GITHUB_OAUTH_CLIENT_SECRET = "test-client-secret";
  process.env.SITE_ORIGIN = "https://site.example";
});
afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.GITHUB_OAUTH_CLIENT_ID;
  delete process.env.GITHUB_OAUTH_CLIENT_SECRET;
  delete process.env.SITE_ORIGIN;
});

function stateFromCookie(res) {
  return /decap_oauth_state=([a-f0-9]+)/.exec(res.headers["set-cookie"])[1];
}

test("auth redirects to GitHub with the callback, scope and a fresh state cookie", () => {
  const res = mockRes();
  authHandler({ method: "GET", query: { provider: "github", scope: "repo" } }, res);
  assert.equal(res.statusCode, 302);
  const location = new URL(res.headers.location);
  assert.equal(location.origin, "https://github.com");
  assert.equal(location.searchParams.get("client_id"), "test-client-id");
  assert.equal(location.searchParams.get("redirect_uri"), "https://site.example/api/callback");
  assert.equal(location.searchParams.get("scope"), "repo");
  assert.equal(location.searchParams.get("state"), stateFromCookie(res));
  assert.match(res.headers["set-cookie"], /HttpOnly/);
  assert.match(res.headers["set-cookie"], /Secure/);
});

test("auth rejects unknown providers and wrong methods; unexpected scopes fall back to repo", () => {
  let res = mockRes();
  authHandler({ method: "GET", query: { provider: "gitlab" } }, res);
  assert.equal(res.statusCode, 400);

  res = mockRes();
  authHandler({ method: "POST", query: { provider: "github" } }, res);
  assert.equal(res.statusCode, 405);

  res = mockRes();
  authHandler({ method: "GET", query: { provider: "github", scope: "admin:org delete_repo" } }, res);
  assert.equal(new URL(res.headers.location).searchParams.get("scope"), "repo");
});

test("auth refuses to run when OAuth is not configured, without revealing settings", () => {
  delete process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const res = mockRes();
  authHandler({ method: "GET", query: { provider: "github" } }, res);
  assert.equal(res.statusCode, 500);
  assert.doesNotMatch(res.body, /secret|client/i);
});

test("callback rejects a mismatched state without calling GitHub, and clears the cookie", async () => {
  let called = false;
  globalThis.fetch = async () => { called = true; return { ok: true, json: async () => ({}) }; };

  const res = mockRes();
  await callbackHandler({ query: { code: "abc", state: "attacker" }, headers: { cookie: "decap_oauth_state=genuine" } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(called, false);
  assert.doesNotMatch(res.body, /access_token/);
  assert.match(res.body, /authorization:github:error:/);
  assert.match(res.headers["set-cookie"], /Max-Age=0/);
});

test("callback exchanges the code and posts the token only to the site origin", async () => {
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, body: JSON.parse(init.body) };
    return { ok: true, json: async () => ({ access_token: "gho_testtoken" }) };
  };

  const res = mockRes();
  await callbackHandler({ query: { code: "the-code", state: "s1" }, headers: { cookie: "decap_oauth_state=s1" } }, res);

  assert.equal(sent.url, "https://github.com/login/oauth/access_token");
  assert.equal(sent.body.client_secret, "test-client-secret");
  assert.equal(sent.body.code, "the-code");
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /authorization:github:success:/);
  assert.match(res.body, /gho_testtoken/);
  assert.match(res.body, /var target = "https:\/\/site\.example";/, "postMessage target must be the site origin");
  assert.doesNotMatch(res.body, /postMessage\(result, "\*"\)/);
  assert.equal(res.headers["cache-control"], "no-store");
});

test("callback reports GitHub failures without leaking details", async () => {
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ error: "bad_verification_code", error_description: "internal detail" }) });
  const res = mockRes();
  await callbackHandler({ query: { code: "x", state: "s1" }, headers: { cookie: "decap_oauth_state=s1" } }, res);
  assert.equal(res.statusCode, 502);
  assert.doesNotMatch(res.body, /internal detail|bad_verification_code/);
  assert.match(res.body, /authorization:github:error:/);
});
