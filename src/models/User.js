import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    userPassword: { type: String, required: true },
    username: { type: String, required: true },
    history: { type: Array, required: true, default: [0] },
});

const User = mongoose.model("User", userSchema);

export default User;
