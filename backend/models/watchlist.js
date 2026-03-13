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

const WatchlistItem = mongoose.model("WatchlistItem", watchlistSchema)
export default WatchlistItem