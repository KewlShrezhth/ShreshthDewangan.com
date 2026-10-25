import assert from "node:assert/strict";
import { normalizeLinkUrl } from "../src/lib/normalize-url.ts";

assert.equal(normalizeLinkUrl(""), "");
assert.equal(normalizeLinkUrl("ranjanabeauty.com"), "https://ranjanabeauty.com");
assert.equal(normalizeLinkUrl("https://x.com"), "https://x.com");
assert.equal(normalizeLinkUrl("http://x.com"), "http://x.com");
assert.equal(normalizeLinkUrl("HTTPS://x.com"), "HTTPS://x.com");
assert.equal(normalizeLinkUrl("//x.com"), "https://x.com");
assert.equal(normalizeLinkUrl("  x.com  "), "https://x.com");
assert.equal(normalizeLinkUrl("ranjanabeauty.com:8080"), "https://ranjanabeauty.com:8080");
assert.throws(() => normalizeLinkUrl("javascript:alert(1)"), /Unsupported link scheme/);
assert.throws(() => normalizeLinkUrl("data:text/html,hi"), /Unsupported link scheme/);

console.log("check-url: all cases passed");
