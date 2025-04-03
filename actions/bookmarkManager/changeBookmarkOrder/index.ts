"use server";

import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import { connectToDatabase } from "@/lib/db";
import { getRedisBookmarkKey, redis } from "@/lib/redis";
import { ErrorResponse, SuccessResponse } from "@/lib/types";
import { UserBookmarks } from "@/model/bookmark";
export const changeBookmarkOrder = async (
  clientItems: Array<Bookmark>
): Promise<SuccessResponse<null> | ErrorResponse> => {
  try {
    await connectToDatabase();
    const userId = await getCurrentUserOrGuestID();

    // get bookmarks from db
    let currentBookmarks = await UserBookmarks.findOne({ userId: userId })
      .select("bookmarks -_id")
      .exec();
    currentBookmarks = currentBookmarks.bookmarks;

    if (clientItems.length !== currentBookmarks.length) {
      //length of items in item and client not the same.
      //in that case, clear cache and make user try again
      const redisKey = getRedisBookmarkKey(userId);
      redis.del(redisKey);
      console.error("Cache and client item mismatch. clearing cache and making user try again.")
      return {
        status: "error",
        message:"Internal server error. Please try again!"
      };
    }

    //get bookmark ids from client
    const clientItemIds = clientItems.map((item) => item._id);

    // transform the bookmarks from db into a map {objectIdToString():objectId}
    const bookmarkMap = new Map(
      currentBookmarks.map((objId: any) => [objId.toString(), objId])
    );

    // reorder currentBookmarks based on clientItemIds
    const sortedBookmarks = clientItemIds.map((id) => bookmarkMap.get(id));
    const res = await UserBookmarks.updateOne(
      { userId },
      { bookmarks: sortedBookmarks }
    );


    //clear cache
    const redisKey = getRedisBookmarkKey(userId);
    redis.del(redisKey);
    return {
      status: "success",
      data: null,
    };
  } catch (e) {
    return {
      status: "error",
      message: "Error: " + e,
    };
  }
};
