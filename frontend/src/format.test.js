import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDate, bestWebcast, readJson } from "./format.js";

test("a valid launch time becomes a readable date", () => {
  const text = formatDate("2026-10-20T10:30:00Z");
  assert.match(text, /2026/);
  assert.doesNotMatch(text, /T10:30:00Z/);
});

test("a missing or invalid time says so instead of 'Invalid Date'", () => {
  assert.equal(formatDate(undefined), "Date not set");
  assert.equal(formatDate("not a date"), "Date not set");
});

test("the webcast with the lowest priority number is chosen", () => {
  const launch = { vid_urls: [{ url: "https://b", priority: 10 }, { url: "https://a", priority: 1 }] };
  assert.equal(bestWebcast(launch), "https://a");
});

test("no webcast links means null", () => {
  assert.equal(bestWebcast({ vid_urls: [] }), null);
  assert.equal(bestWebcast({}), null);
  assert.equal(bestWebcast(null), null);
});

test("readJson returns the body for a good response and throws with the status otherwise", async () => {
  assert.deepEqual(await readJson(new Response('{"ok":true}', { status: 200 })), { ok: true });
  await assert.rejects(readJson(new Response("{}", { status: 409 })), e => e.status === 409);
});
