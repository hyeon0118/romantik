import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    history: { type: Array, requied: true, default: [] },
    currentPlaylist: { type: Array, default: [], required: true },
    currentPlaying: { type: String, default: "" },
    liked: { type: Array, default: [], required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
