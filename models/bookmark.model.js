import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
    },
    tags: [String],
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bookmark", bookmarkSchema);
