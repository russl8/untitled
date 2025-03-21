"use server";

import {
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { nanoid } from "nanoid";
import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import Bookmark from "@/Model/bookmark";
import { getListFromRedis, getRedisBookmarkKey, redis } from "@/lib/redis";
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

export async function createBookmark(formData: FormData) {
  /**
   * 1. get fields from form
   * 2. upload image to s3 and get the image's key
   * 3. then upload the bookmark to mongodb using the key as one of the attributes
   */
  try {
    if (
      !formData.get("bookmarkImage") ||
      !formData.get("bookmarkName") ||
      !formData.get("bookmarkLink")
    ) {
      return { error: "Missing required fields" };
    }

    //upload image to s3 and get the public file key
    const uploadImageResponse = await uploadImageToS3(formData);
    if (uploadImageResponse.error) {
      return { error: "File upload to S3 failed" };
    }
    const s3FileKey = uploadImageResponse.s3FileKey;

    if (!s3FileKey || s3FileKey === "") {
      return { error: "Missing s3 fle key" };
    }
    const res = await uploadBookmarkToMongoDB(s3FileKey, formData);
    if (!res) {
      return { error: "Database upload failed" };
    }

    return {
      success: true,
    };
  } catch (e: any) {
    console.error(e);
    return { error: "Unexpected server error" };
  }
}

export async function uploadImageToS3(formData: FormData) {
  try {
    const client = new S3Client({
      region: process.env.AWS_REGION,
    });
    const s3FileKey = nanoid();
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: s3FileKey,
    });

    //create formdata to send to s3
    const formDataForS3 = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formDataForS3.append(key, value);
    });
    formDataForS3.append("file", formData.get("bookmarkImage") as string);
    const s3ImageUploadResponse: any = await fetch(url, {
      method: "POST",
      body: formDataForS3,
    });

    const textResponse = await s3ImageUploadResponse.text();
    console.log(textResponse);
    if (!s3ImageUploadResponse.ok) {
      return {
        error: "Error uploading image to s3",
      };
    }
    return {
      success: true,
      s3FileKey: s3FileKey,
    };
  } catch (e) {
    console.error(e);
    return { error: "Error uploding image to s3" };
  }
}

export async function uploadBookmarkToMongoDB(
  s3FileKey: string,
  formData: FormData
) {
  try {
    // see if user is signed in. if not, they are treated as a guest
    const userId = await getCurrentUserOrGuestID();

    // is response is ok, upload bookmark to mongodb
    const publicImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3FileKey}`;
    await connectToDatabase();

    const newBookmark = await Bookmark.create({
      userId,
      bookmarkName: formData.get("bookmarkName"),
      bookmarkImage: publicImageUrl,
      bookmarkLink: formData.get("bookmarkLink"),
      s3FileKey: s3FileKey,
    });

    /**
     * See if this user's bookmarks exist in redis.
     * if they do, append to the existing redis list.
     */
    const redisKey = getRedisBookmarkKey(userId);
    const cachedBookmarks = await getListFromRedis(userId);
    const stringifiedBookmark = JSON.stringify(newBookmark);

    if (cachedBookmarks) {
      await redis.rpush(redisKey, stringifiedBookmark);
    }

    // revalidatePath("/api/dashboard/bookmarkManager");
    return {
      success: true,
      mongoDbResponse: newBookmark,
    };
  } catch (e) {
    return {
      error: "Error with uploading to db: " + e,
    };
  }
}
