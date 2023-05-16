import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    history: { type: Array, default: [0] },
    profile: { type: String, default: "none" },
    currentPlaylist: { type: Array },
    currentPlaying: { type: String },
    playlist: { type: Object },
});

const User = mongoose.model("User", userSchema);

export default User;
