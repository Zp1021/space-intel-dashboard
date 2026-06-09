# Backend — Aerospace Mission Analytics Platform
Node.js and Express API that pulls launch and mission data from external space
APIs, stores it in MongoDB, and serves it to the frontend.

## Setup
```
 npm install
 npm start
```
Create a .env file in this folder before starting. It needs:
```
 MONGODB_URI=your_mongodb_connection_string
 PORT=5000
```
The server runs on the port set in .env (default 5000). Make sure MongoDB is
reachable and the frontend points at this same port.

## Structure
- index.js — server entry point and route setup
- db.js — MongoDB connection
- models/ — Mongoose schemas