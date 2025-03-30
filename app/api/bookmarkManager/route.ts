import { getCurrentUserOrGuestID } from "../helpers";
import { NextResponse } from "next/server";
import {
  getListFromRedis,
  getRedisBookmarkKey,
  addArrayToRedisKey,
  redis,
} from "@/lib/redis";
import { connectToDatabase } from "@/lib/db";
import { Bookmark, UserBookmarks } from "@/model/bookmark";
import { ErrorResponse, SuccessResponse } from "@/lib/types";

export async function GET(
  request: Request
): Promise<NextResponse<SuccessResponse<any[]> | ErrorResponse>> {
  try {
    const userId = await getCurrentUserOrGuestID();
    const redisKey = getRedisBookmarkKey(userId);
    const cachedBookmarks = await getListFromRedis(redisKey);
    //test. move under cache response later

    // see if user's bookmarks are in cache
    if (cachedBookmarks.length > 0) {
      return NextResponse.json(
        {
          status: "success",
          data: cachedBookmarks,
        },
        { status: 200 }
      );
    }

    // if bookmarks not in cache, query the db
    // const userBookmarks = await Bookmark.find({ userId: userId }).exec();
    await connectToDatabase();
    const orderedBookmarks = await UserBookmarks.findOne({ userId: userId })
      .populate("bookmarks") // This replaces the ObjectIds with the corresponding Bookmark documents
      .select("bookmarks -_id") // Only select the bookmarks field, excluding _id
      .exec();

    const orderedBookmarksArray = orderedBookmarks?.bookmarks || [];
    console.log(orderedBookmarksArray);
    if (orderedBookmarksArray.length > 0) {
      await addArrayToRedisKey(redisKey, orderedBookmarksArray);
    }

    return NextResponse.json(
      { status: "success", data: orderedBookmarksArray },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        status: "error",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
