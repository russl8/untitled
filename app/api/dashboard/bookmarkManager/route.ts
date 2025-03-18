import clientPromise from "@/lib/mongodb";
import { getCurrentUserOrGuestID } from "../../helpers";
import { NextResponse } from "next/server";
import { getListFromRedis, getRedisBookmarkKey, setRedisValueToList, redis } from "@/lib/redis";

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

    const mongoDbClient = await clientPromise;
    if (!mongoDbClient) {
      return NextResponse.json(
        { error: "Server error, Mongodb client not found" },
        { status: 500 }
      );
    }

    // if bookmarks not in cache, query the db
    const db = mongoDbClient.db("untitled");
    const userBookmarks = await db
      .collection("bookmarks")
      .find({ userId: id })
      .toArray();

    // add queried bookmarks to cache
    await setRedisValueToList(redisKey, userBookmarks)
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
