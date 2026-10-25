import assert from "node:assert/strict";
import { createSessionToken, verifySessionToken, SESSION_MAX_AGE_SECONDS } from "../src/lib/session-token.ts";

const secret = "test-secret-for-session-token-checks";
const now = Date.now();
const token = await createSessionToken(secret, now);
const [exp, sig] = token.split(".");

assert.match(token, /^\d+\.[A-Za-z0-9_-]+$/);
assert.equal(Number(exp), now + SESSION_MAX_AGE_SECONDS * 1000);
assert.equal(await verifySessionToken(token, secret, now), true, "fresh token verifies");

const flipped = sig[0] === "A" ? "B" + sig.slice(1) : "A" + sig.slice(1);
assert.equal(await verifySessionToken(`${exp}.${flipped}`, secret, now), false, "flipped signature fails");
assert.equal(await verifySessionToken(`${Number(exp) + 1}.${sig}`, secret, now), false, "altered exp fails");
assert.equal(await verifySessionToken(token, secret, Number(exp) + 1), false, "expired token fails");
assert.equal(await verifySessionToken(token, "wrong-secret", now), false, "wrong secret fails");
assert.equal(await verifySessionToken(undefined, secret, now), false, "undefined fails");
assert.equal(await verifySessionToken("", secret, now), false, "empty fails");
assert.equal(await verifySessionToken("garbage", secret, now), false, "garbage fails");

console.log("session token checks passed");
