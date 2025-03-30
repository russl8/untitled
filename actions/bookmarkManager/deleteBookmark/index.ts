"use server";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import { Bookmark, UserBookmarks } from "@/model/bookmark";
import { getRedisBookmarkKey, redis } from "@/lib/redis";
import { connectToDatabase } from "@/lib/db";
import { ErrorResponse, SuccessResponse } from "@/lib/types";

export async function deleteBookmark(
  bookmarkId: string
): Promise<SuccessResponse<null> | ErrorResponse> {
  try {
    await connectToDatabase();
    const bookmark: Bookmark | null = await Bookmark.findById(bookmarkId);
    if (!bookmark) {
      return {
        status: "error",
        message: "Deleting bookmark but does not exist: " + bookmarkId,
      };
    }
    const s3FileKey = bookmark?.s3FileKey || "";

    const client = new S3Client({
      region: process.env.AWS_REGION,
    });

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: s3FileKey,
    });

    // delete bookmark from s3 and mongodb
    const deleteObjectFromS3Response = await client.send(deleteObjectCommand);
    const deleteBookmarkFromMongoDBResponse = await Bookmark.findByIdAndDelete(
      bookmarkId
    );

    await UserBookmarks.updateMany(
      { bookmarks: bookmarkId },
      { $pull: { bookmarks: bookmarkId } }
    );

    //Delete bookmark from cache if cache exists
    const userId = await getCurrentUserOrGuestID();
    const redisKey = getRedisBookmarkKey(userId);
    const cachedBookmarks = await redis.lrange(redisKey, 0, -1); // Get length of current bookmarks in cache.

    // Look for bookmark in cache and if found, delete it.
    if (cachedBookmarks.length > 0) {
      const bookmarkToRemove = cachedBookmarks.find((b) => {
        const parsedBookmark = JSON.parse(b);
        return parsedBookmark._id === bookmarkId;
      });
      if (bookmarkToRemove) {
        const removedCount = await redis.lrem(redisKey, 0, bookmarkToRemove);
      } else {
        return {
          status: "error",
          message: "Bookmark not found in cache",
        };
      }
    }
    return {
      status: "success",
      message: "Item deleted from s3, mongodb, cache",
      data: null,
    };
  } catch (e) {
    return {
      status: "error",
      message: "Bookmark not found in cache",
    };
  }
}
