import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
    title: { type: String, required: true },
    composer: { type: String, required: true },
    videoId: { type: String, required: true },
    view: { type: Number, required: true },
    performer: { type: String, required: true },
    time: { type: String, required: true },
    character: { type: String, required: true }
});

const Work = mongoose.model("Work", workSchema);

export default Work;
