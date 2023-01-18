import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  email: String,
  profilesrc: {
    type: String,
    default: "",
  },
  favoritePosts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post"
  },
  refreshTokens: {
    type: [String],
    default: [],
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", UserSchema);
