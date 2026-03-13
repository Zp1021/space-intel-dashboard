// Import mongoose for DB connection
import mongoose from "mongoose";

// Async function to connect to mongo DB
async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB connected')
    } catch (e) {
        console.log(e)
    }
}

// Exports connect function for use in index.js
export default connectDb