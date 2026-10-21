# Frontend — Aerospace Mission Analytics Platform
React frontend built with Vite. It shows the launch data served by the backend
API, with client-side routing via react-router-dom.

## Setup
```
npm install
cp .env.example .env
npm run dev
```
The .env file holds VITE_API_URL, the address of the backend
(http://localhost:5000 by default).

The dev server runs on the port Vite prints to the console (default
http://localhost:5173). The backend needs to be running for data to load; see
the backend folder for its setup.

## Scripts
```
npm run dev      # start the dev server
npm test         # tests for src/format.js
npm run lint     # ESLint
npm run build    # production build into dist/
```
