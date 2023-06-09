import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: { type: String, default: "playlist", required: true },
    playlist: { type: Array, default: [], required: true },
    userId: { type: String, defult: "", required: true },
    username: { type: String, default: "", required: true },
    thumbnails: { type: Array, default: [], required: true }
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
