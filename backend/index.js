import express from "express";
import cors from "cors";
import axios from "axios";
import 'dotenv/config'
import connectDb from "./db.js";
import WatchlistItem from "./models/watchlist.js";
import BriefingNote from "./models/brief.js";

// Initializing server
const app = express();

// Port for the express server (5000 if .env does not set one)
const port = process.env.PORT || 5000;

// Launch Library 2 base URL (the current API version if .env does not set one)
const ll2Base = process.env.LL2_BASE || "https://ll.thespacedevs.com/2.3.0";

// Middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

// ---------- Launch data from Launch Library 2 ----------

// Launch Library 2's free tier allows only 15 requests per hour, so every
// answer from it is kept in memory for 10 minutes and reused.
const CACHE_MS = 10 * 60 * 1000;
const cache = new Map(); // url -> { savedAt, data }

async function getLaunchLibrary(url, params = {}) {
  const key = url + JSON.stringify(params);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.savedAt < CACHE_MS) return cached.data;
  try {
    const r = await axios.get(url, { params });
    cache.set(key, { savedAt: Date.now(), data: r.data });
    return r.data;
  } catch (e) {
    // If the live API fails, an older copy is better than nothing
    if (cached) return cached.data;
    throw e;
  }
}

// 503 tells the browser "busy, try later" (rate limit); 502 means the outside API failed
function upstreamStatus(e) {
  return e.response?.status === 429 ? 503 : 502;
}

// GET upcoming launches
app.get("/api/launches/upcoming", async (req, res) => {
  // Accept a whole number from 1 to 100; anything else falls back to 25
  const asked = Number.parseInt(req.query.limit, 10);
  const limit = asked >= 1 && asked <= 100 ? asked : 25;
  try {
    res.json(await getLaunchLibrary(`${ll2Base}/launches/upcoming/`, { limit }));
  } catch (e) {
    res.status(upstreamStatus(e)).json({ error: "Failed to fetch upcoming launches" });
  }
});

// GET one launch by its ID (includes rocket, orbit and webcast details)
app.get("/api/launches/:id", async (req, res) => {
  try {
    const id = encodeURIComponent(req.params.id);
    res.json(await getLaunchLibrary(`${ll2Base}/launches/${id}/`));
  } catch (e) {
    const status = e.response?.status === 404 ? 404 : upstreamStatus(e);
    res.status(status).json({ error: "Failed to fetch launch details" });
  }
});

// ---------- Watchlist (stored in MongoDB) ----------

// POST a new watchlist item
app.post("/api/watchlist", async (req, res) => {
  try {
    const item = await WatchlistItem.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    // 11000 is MongoDB's "duplicate key" error: this launch is already saved
    if (e.code === 11000) return res.status(409).json({ error: "Already in watchlist" });
    if (e.name === "ValidationError") return res.status(400).json({ error: "Missing launch details" });
    res.status(500).json({ error: "Failed to save watchlist item" });
  }
});

// GET all watchlist items, newest first
app.get("/api/watchlist", async (req, res) => {
  try {
    const items = await WatchlistItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// DELETE a watchlist item by ID
app.delete("/api/watchlist/:id", async (req, res) => {
  try {
    const deleted = await WatchlistItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Watchlist item not found" });
    res.json({ deleted: true });
  } catch (e) {
    // A badly formed ID cannot match any item
    if (e.name === "CastError") return res.status(404).json({ error: "Watchlist item not found" });
    res.status(500).json({ error: "Failed to delete watchlist item" });
  }
});

// ---------- Briefing notes (stored in MongoDB) ----------

// POST a new briefing note
app.post("/api/briefs", async (req, res) => {
  try {
    const note = await BriefingNote.create(req.body);
    res.status(201).json(note);
  } catch (e) {
    if (e.name === "ValidationError") return res.status(400).json({ error: "Please fill in every field" });
    res.status(500).json({ error: "Failed to save briefing note" });
  }
});

// GET briefing notes for a specific launch, newest first
app.get("/api/briefs/:launchId", async (req, res) => {
  try {
    const notes = await BriefingNote.find({ launchId: req.params.launchId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch briefing notes" });
  }
});

// Start the server only when this file is run directly (npm start),
// not when the tests import it
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
    connectDb();
  });
}

export default app;
