import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    bookmarkName: {
      type: String,
      required: true,
      trim: true,
    },
    bookmarkImage: {
      type: String,
      required: true,
    },
    bookmarkLink: {
      type: String,
      required: true,
      match: [/^https?:\/\/.*/, "Invalid URL format"],
    },
  },
  { timestamps: true }
);

const Bookmark = mongoose.models.Bookmark || mongoose.model("Bookmark", BookmarkSchema);

export default Bookmark;
