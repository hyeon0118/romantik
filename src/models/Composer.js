import mongoose from "mongoose";

const composerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dates: { type: String, required: true },
    bio: { type: String, required: true },
    picture: { type: String, required: true }
});

const Composer = mongoose.model("Composer", composerSchema);

export default Composer;
