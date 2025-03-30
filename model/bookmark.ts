import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { string } from "zod";

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
    s3FileKey: {
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

const UserBookmarksSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  bookmarks:{
    type:  [ObjectId],
    required:true
  },
});

export const UserBookmarks =
  mongoose.models.UserBookmarks ||
  mongoose.model("UserBookmarks", UserBookmarksSchema);
export const Bookmark =
  mongoose.models.Bookmark || mongoose.model("Bookmark", BookmarkSchema);

