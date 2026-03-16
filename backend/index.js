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

// Env variable for LL2 API base URL
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

// Env variable for SpaceX API base URL
const spacexBase = process.env.SPACEX_BASE;

app.get("/api/enrich/spacex", async (req, res) => {
  try {
    const { name, date } = req.query;
    if (!name) return res.status(400).json({ error: "Missing name" });

    // Use SpaceX /launches/query to search by name keyword
    const queryBody = {
      query: {
        name: { $regex: name, $options: "i" }
      },
      options: { limit: 5 }
    };

    const q = await axios.post(`${SPACEX_BASE}/launches/query`, queryBody);
    const docs = q.data?.docs || [];
    if (!docs.length) return res.json({ found: false });

    // If we have a date, pick the closest launch date
    let best = docs[0];
    if (date) {
      const target = new Date(date).getTime();
      best = docs.reduce((acc, cur) => {
        const a = Math.abs(new Date(acc.date_utc).getTime() - target);
        const b = Math.abs(new Date(cur.date_utc).getTime() - target);
        return b < a ? cur : acc;
      }, docs[0]);
    }

    // Fetch rocket name (optional)
    let rocket = null;
    if (best.rocket) {
      const rr = await axios.get(`${spacexBase}/rockets/${best.rocket}`);
      rocket = rr.data;
    }

    res.json({
      found: true,
      launch: best,
      rocket,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to enrich SpaceX data" });
  }
});