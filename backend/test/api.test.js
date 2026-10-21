// API tests. They need no internet and no database:
// - a tiny fake "Launch Library" server stands in for the real one
// - the two database models are replaced with simple in-memory versions
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import WatchlistItem from "../models/watchlist.js";
import BriefingNote from "../models/brief.js";

// ---------- fake Launch Library ----------
let fakeCalls = 0;
let fakeStatus = 200;
const fake = http.createServer((req, res) => {
  fakeCalls++;
  if (req.url.includes("missing")) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end("{}");
  }
  res.writeHead(fakeStatus, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ path: req.url, results: [{ id: "abc", name: "Test Launch" }] }));
});

// ---------- in-memory stand-ins for the database ----------
let saved = [];
WatchlistItem.create = async (body) => {
  const doc = new WatchlistItem(body);
  await doc.validate();                       // the real schema rules still apply
  if (saved.some(s => s.launchId === doc.launchId)) {
    throw Object.assign(new Error("duplicate key"), { code: 11000 });
  }
  saved.push(doc);
  return doc;
};
WatchlistItem.find = () => ({ sort: async () => saved });
WatchlistItem.findByIdAndDelete = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw Object.assign(new Error("bad id"), { name: "CastError" });
  const found = saved.find(s => String(s._id) === id);
  saved = saved.filter(s => s !== found);
  return found || null;
};
BriefingNote.create = async (body) => {
  const doc = new BriefingNote(body);
  await doc.validate();
  return doc;
};

let server, base;

before(async () => {
  await new Promise(r => fake.listen(0, r));
  process.env.NODE_ENV = "test";
  process.env.LL2_BASE = `http://127.0.0.1:${fake.address().port}`;
  const { default: app } = await import("../index.js");
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
  fake.close();
});

const post = (path, body) => fetch(`${base}${path}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});

test("health check answers ok", async () => {
  const r = await fetch(`${base}/api/health`);
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true });
});

test("upcoming launches come from Launch Library's /launches/upcoming/ endpoint", async () => {
  const r = await fetch(`${base}/api/launches/upcoming?limit=5`);
  assert.equal(r.status, 200);
  const body = await r.json();
  assert.equal(body.results[0].name, "Test Launch");
  assert.ok(body.path.startsWith("/launches/upcoming/?limit=5"));
});

test("a second request within 10 minutes is served from the cache", async () => {
  const before = fakeCalls;
  await fetch(`${base}/api/launches/upcoming?limit=7`);
  await fetch(`${base}/api/launches/upcoming?limit=7`);
  assert.equal(fakeCalls - before, 1);
});

test("a bad limit falls back to 25 instead of being sent upstream", async () => {
  const r = await fetch(`${base}/api/launches/upcoming?limit=abc`);
  assert.equal(r.status, 200);
  assert.ok((await r.json()).path.includes("limit=25"));
});

test("when Launch Library is rate-limited and nothing is cached, the API says 503", async () => {
  fakeStatus = 429;
  const r = await fetch(`${base}/api/launches/upcoming?limit=9`);
  fakeStatus = 200;
  assert.equal(r.status, 503);
});

test("launch details come from /launches/<id>/ and are cached too", async () => {
  const before = fakeCalls;
  const r = await fetch(`${base}/api/launches/xyz`);
  await fetch(`${base}/api/launches/xyz`);
  assert.equal((await r.json()).path, "/launches/xyz/");
  assert.equal(fakeCalls - before, 1);
});

test("an unknown launch ID returns 404", async () => {
  const r = await fetch(`${base}/api/launches/missing-id`);
  assert.equal(r.status, 404);
});

const launch = {
  launchId: "abc", name: "Test Launch", provider: "SpaceX",
  launchTime: "2026-10-20T10:30:00Z", location: "Cape Canaveral SFS, FL, USA"
};

test("a launch can be saved to the watchlist and listed", async () => {
  const r = await post("/api/watchlist", launch);
  assert.equal(r.status, 201);
  const list = await (await fetch(`${base}/api/watchlist`)).json();
  assert.equal(list.length, 1);
  assert.equal(list[0].name, "Test Launch");
});

test("saving the same launch twice returns 409", async () => {
  const r = await post("/api/watchlist", launch);
  assert.equal(r.status, 409);
  assert.equal((await r.json()).error, "Already in watchlist");
});

test("a watchlist item with missing details returns 400", async () => {
  const r = await post("/api/watchlist", { launchId: "only-an-id" });
  assert.equal(r.status, 400);
});

test("a watchlist item can be deleted; deleting it again returns 404", async () => {
  const [item] = await (await fetch(`${base}/api/watchlist`)).json();
  const first = await fetch(`${base}/api/watchlist/${item._id}`, { method: "DELETE" });
  assert.equal(first.status, 200);
  const again = await fetch(`${base}/api/watchlist/${item._id}`, { method: "DELETE" });
  assert.equal(again.status, 404);
});

test("deleting with a badly formed ID returns 404", async () => {
  const r = await fetch(`${base}/api/watchlist/not-an-id`, { method: "DELETE" });
  assert.equal(r.status, 404);
});

test("a complete briefing note is saved; an incomplete one returns 400", async () => {
  const good = await post("/api/briefs", {
    launchId: "abc", title: "T", summary: "S", keyObservations: "K", watchItems: "W", sources: []
  });
  assert.equal(good.status, 201);
  const bad = await post("/api/briefs", { launchId: "abc", title: "T" });
  assert.equal(bad.status, 400);
  assert.equal((await bad.json()).error, "Please fill in every field");
});
