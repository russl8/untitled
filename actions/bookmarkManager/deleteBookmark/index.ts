"use server";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import Bookmark from "@/model/bookmark";
import { getRedisBookmarkKey, redis } from "@/lib/redis";
import { connectToDatabase } from "@/lib/db";

export async function deleteBookmark(bookmarkId: string) {
  try {
    await connectToDatabase();
    const bookmark: Bookmark | null = await Bookmark.findById(bookmarkId);
    if (!bookmark) {
      return { error: "Deleting bookmark but does not exist: " + bookmarkId };
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
    await client.send(deleteObjectCommand);
    await Bookmark.findByIdAndDelete(bookmarkId);

    //Delete bookmark from cache if cache exists
    const userId = await getCurrentUserOrGuestID();
    const redisKey = getRedisBookmarkKey(userId);
    const cachedBookmarks = await redis.lrange(redisKey, 0, -1);
    if (cachedBookmarks.length > 0) {
      const bookmarkToRemove = cachedBookmarks.find((b) => {
        const parsedBookmark = JSON.parse(b);
        return parsedBookmark._id === bookmarkId;
      });

      if (bookmarkToRemove) {
        const removedCount = await redis.lrem(redisKey, 0, bookmarkToRemove);
      } else {
        console.log("Bookmark not found in cache");
      }
    }
    return {
      success: true,
      message: "Item deleted from s3, mongodb, cache",
    };
  } catch (e) {
    return {
      error: "An exception occured with deleting bookmark: " + e,
    };
  }
}
