# Aerospace Mission Analytics Platform
A full-stack dashboard for tracking upcoming and past space launches. It pulls
live data from the Launch Library 2 and SpaceX APIs, stores it in MongoDB, and
serves it through an Express API to a React front end.
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
cd backend
npm install
npm start
Frontend:
cd frontend
npm install
npm run dev
You'll need a MongoDB connection string in a .env file in the backend folder.
See backend/.env.example for the variables it expects.

## Status
Active. Currently adding pages and components on the frontend and expanding
test coverage on the backend.