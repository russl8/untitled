import { getCurrentUserOrGuestID } from "../../helpers";
import { NextResponse } from "next/server";
import {
  getListFromRedis,
  getRedisBookmarkKey,
  setRedisValueToList,
  redis,
} from "@/lib/redis";
import { connectToDatabase } from "@/lib/db";
import Bookmark from "@/Model/bookmark";

export async function GET(request: Request) {
  try {
    const id = await getCurrentUserOrGuestID();
    const redisKey = getRedisBookmarkKey(id);
    const cachedBookmarks = await getListFromRedis(redisKey);

    // see if user's bookmarks are in cache
    if (cachedBookmarks.length > 0) {
      return NextResponse.json(
        {
          message: "Success",
          bookmarks: cachedBookmarks,
        },
        { status: 200 }
      );
    }

    // if bookmarks not in cache, query the db
    await connectToDatabase();
    const userBookmarks = await Bookmark.find({ userId: id }).exec();

    // add queried bookmarks to cache
    await setRedisValueToList(redisKey, userBookmarks);
    return NextResponse.json(
      { message: "Success", bookmarks: userBookmarks },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
