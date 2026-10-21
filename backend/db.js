// Import mongoose for DB connection
import mongoose from "mongoose";

// Async function to connect to mongo DB
async function connectDb() {
    if (!process.env.MONGO_URL) {
        console.log("MONGO_URL is not set in backend/.env, so the watchlist and briefing notes will not work.");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');
    } catch (e) {
        console.log("Could not connect to MongoDB:", e.message);
    }
}

// Exports connect function for use in index.js
export default connectDb;
