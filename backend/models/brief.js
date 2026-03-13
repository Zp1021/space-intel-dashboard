// Importing mongoose
import mongoose from "mongoose";

const BriefSchema = new mongoose.Schema({
    launchId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    keyObservations: {
        type: String,
        required: true
    },
    watchItems: {
        type: String,
        required: true
    },
    sources: {
        type: [String],
        required: true
    }
},
{
    timestamps: true
});

// How the schema should be called
const BriefingNote = mongoose.model("BriefingNote", BriefSchema);

// Exporting the schema
export default BriefingNote