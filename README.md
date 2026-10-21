# Aerospace Mission Analytics Platform

![tests](https://github.com/Zp1021/space-intel-dashboard/actions/workflows/tests.yml/badge.svg)

A full-stack dashboard for tracking upcoming space launches. An Express API
pulls live launch data from the Launch Library 2 API and serves it to a React
front end. Launches you save to the watchlist and the briefing notes you write
are stored in MongoDB.

I built this to practice keeping a real application maintained over time rather
than building something once and abandoning it: handling external API changes
and limits, keeping stored data in sync, and structuring a project as a
separate backend and frontend.

## Built with
- Frontend: React, Vite, React Router
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- External data: Launch Library 2 API (version 2.3.0)
- Testing: Node's built-in test runner, ESLint, GitHub Actions

## Features
- Upcoming launch list with search by mission name and a provider filter
- Launch detail page: date, status, provider, rocket, pad, mission type, orbit,
  description and webcast link
- Watchlist of saved launches (stored in MongoDB); saving the same launch twice
  is refused with a clear message
- Briefing notes written per launch (stored in MongoDB)
- Clear messages instead of blank pages when data cannot load

## How it handles the outside API
Launch Library 2's free tier allows 15 requests per hour. The backend keeps
each Launch Library answer in memory for 10 minutes, so repeat visits do not
use up the limit. If Launch Library fails and an older copy exists, the older
copy is served. If nothing is cached, the API returns 503 (rate limited) or
502 (outside API failed), and the page explains the problem instead of showing
an empty list.

## Maintenance log
- **October 2026:** the community SpaceX API this project used for extra rocket
  and webcast details shut down in June 2026. Launch Library 2 already provides
  the rocket, orbit and webcast links, so the SpaceX calls were removed and the
  project moved to Launch Library's current version, 2.3.0. Added response
  caching, API tests and clear error messages, and replaced an outdated
  development tool that had 14 known security warnings.

## Running it locally
Requires Node.js 18 or newer and a MongoDB database (a free MongoDB Atlas
cluster works).

Backend:
```
cd backend
npm install
cp .env.example .env
npm start
```
Open backend/.env and set MONGO_URL to your MongoDB connection string.
Use `npm run dev` instead of `npm start` to restart automatically on changes.

Frontend (in a second terminal):
```
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open the address Vite prints (usually http://localhost:5173). frontend/.env
tells the React app where the backend is running (http://localhost:5000 by
default).

## Tests
```
cd backend && npm test     # 13 API tests
cd frontend && npm test    # 5 tests for the date and webcast helpers
```
The backend tests use a small fake Launch Library server and in-memory stand-ins
for the two database models, so they need no internet and no database. GitHub
Actions runs both test suites, plus a lint and build of the frontend, on every
push.

## Project structure
```
backend/index.js            routes, Launch Library cache, server start
backend/db.js               MongoDB connection
backend/models/             watchlist item and briefing note schemas
backend/test/               API tests
frontend/src/pages/         home, dashboard, launch detail, watchlist, briefing notes
frontend/src/components/    navigation bar
frontend/src/format.js      date, webcast and response helpers (with tests)
.github/workflows/          CI for both halves
```

## Next
- Deploy a public demo
- Editing and deleting briefing notes
- User accounts, so each person has their own watchlist

## License
MIT
