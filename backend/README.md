# Backend — Aerospace Mission Analytics Platform
Node.js and Express API. It fetches launch data from Launch Library 2, caches
each answer in memory for 10 minutes, and stores the watchlist and briefing
notes in MongoDB.

## Setup
```
npm install
cp .env.example .env
npm start        # or: npm run dev  (restarts on file changes)
```
The .env file holds:
```
MONGO_URL=your_mongodb_connection_string
PORT=5000
LL2_BASE=https://ll.thespacedevs.com/2.3.0
```
PORT and LL2_BASE fall back to the values above if they are missing. Without
MONGO_URL the launch pages still work, but the watchlist and briefing notes
cannot be saved; the server prints a message saying so.

## API
| Method | Path | What it does |
|---|---|---|
| GET | /api/health | Returns `{ "ok": true }` |
| GET | /api/launches/upcoming?limit=50 | Upcoming launches (limit 1–100, default 25) |
| GET | /api/launches/:id | One launch, with rocket, mission, orbit and webcast links |
| GET | /api/watchlist | Saved launches, newest first |
| POST | /api/watchlist | Save a launch (409 if already saved) |
| DELETE | /api/watchlist/:id | Remove a saved launch (404 if not found) |
| GET | /api/briefs/:launchId | Briefing notes for one launch, newest first |
| POST | /api/briefs | Save a briefing note (400 if a field is missing) |

## Tests
```
npm test
```

## Structure
- index.js — routes, Launch Library cache, server start
- db.js — MongoDB connection
- models/ — Mongoose schemas for watchlist items and briefing notes
- test/ — API tests
