// Importing mongoose
import mongoose from "mongoose";

const watchlistSchema = mongoose.Schema({
    launchId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    launchTime: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    sourceUrl: {
        type: String,
    }
}, 
{
    timestamps: true
})

// How the schema should be called
const WatchlistItem = mongoose.model("WatchlistItem", watchlistSchema)

// Exporting the schema
export default WatchlistItem