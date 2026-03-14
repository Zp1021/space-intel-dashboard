import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDb from "./db.js";
import WatchlistItem from "./models/watchlist.js";

// Initializing server
const app = express();

// port for express server
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Env variable for API base URL
const ll2Base = process.env.LL2_BASE;

// Endpoints
// GET upcoming launches from api
app.get("/api/launches/upcoming", async (req, res) => {
  try {
    const limit = req.query.limit || 25;
    const url = `${ll2Base}/launch/upcoming/?limit=${limit}`;
    const r = await axios.get(url);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch upcoming launches" });
  }
});

// GET launch by ID from api
app.get("/api/launches/:id", async (req, res) => {
  try {
    const { id } = req.params.id;
    const url = `${ll2Base}/launch/${id}`;
    const r = await axios.get(url);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch launch details" });
  }
});


// Port for express server to listen on and connect to DB
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
    connectDb();
 });