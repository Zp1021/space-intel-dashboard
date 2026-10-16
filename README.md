# Aerospace Mission Analytics Platform
A full-stack dashboard for tracking upcoming space launches. An Express API
pulls live data from the Launch Library 2 and SpaceX APIs and serves it to a
React front end. Launches you save to the watchlist and the briefing notes you
write are stored in MongoDB.

I built this to practice keeping a real application maintained over time rather
than building something once and abandoning it: handling external API changes,
keeping stored data in sync, and structuring a project as a separate backend
and frontend.

## Built with
- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB
- External data: Launch Library 2 API, SpaceX API

## Running it locally
Backend:
```
cd backend
npm install
cp .env.example .env
npm start
```
Open backend/.env and set MONGO_URL to your MongoDB connection string.

Frontend (in a second terminal):
```
cd frontend
npm install
cp .env.example .env
npm run dev
```
frontend/.env tells the react app where the backend is running
(https://localhost:5000 by default).

## Status
Working: upcoming launch list with search and provider filter, launch detail page, watchlist, and briefing notes

Next: automated tests for the API routes.