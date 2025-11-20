import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
  profileImgUrl: { type: String },
  refreshToken: { type: String },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
