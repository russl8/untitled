"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { nanoid } from "nanoid";
import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import { Bookmark, UserBookmarks } from "@/model/bookmark";
import { getListFromRedis, getRedisBookmarkKey, redis } from "@/lib/redis";
import { connectToDatabase } from "@/lib/db";
import { ErrorResponse, SuccessResponse } from "@/lib/types";

type ResponseBookmarkData = {
  userId: string;
  bookmarkName: string;
  bookmarkImage: string;
  bookmarkLink: string;
  s3FileKey: string;
};
export async function createBookmark(
  formData: FormData
): Promise<SuccessResponse<ResponseBookmarkData> | ErrorResponse> {
  try {
    if (
      !formData.get("bookmarkImage") ||
      !formData.get("bookmarkName") ||
      !formData.get("bookmarkLink")
    ) {
      const error = "Missing required fields";
      console.error(error);
      return {
        status: "error",
        message: error,
      };
    }

    // upload image to s3 and get the public file key
    const uploadImageResponse = await uploadImageToS3(formData);
    const s3FileKey = uploadImageResponse.s3FileKey;

    if (!s3FileKey || s3FileKey === "") {
      const error = "Missing S3 file key";
      console.error(error);
      return {
        status: "error",
        message: error,
      };
    }

    const res = await uploadBookmarkToMongoDB(s3FileKey, formData);
    if (!res || !res.mongoDbResponse) {
      const error = "Database upload failed";
      console.error(error);
      return {
        status: "error",
        message: error,
      };
    } else {
      return {
        status: "success",
        message: "Bookmark created successfully",
        data: res.mongoDbResponse, // Return the created bookmark data
      };
    }
  } catch (e: any) {
    console.error("Unexpected server error: " + e.message);
    return {
      status: "error",
      message: "Unexpected server error: " + e.message,
    };
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

    // create formdata to send to s3
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
    if (!s3ImageUploadResponse.ok) {
      const error = "Error uploading image to S3";
      console.error(error, textResponse);
      return {
        status: "error",
        message: error,
        code: 500,
      };
    }

    return {
      s3FileKey: s3FileKey,
    };
  } catch (e) {
    console.error("Error uploading image to S3: " + e);
    return {
      status: "error",
      message: "Error uploading image to S3: " + e,
      code: 500,
    };
  }
}

export async function uploadBookmarkToMongoDB(
  s3FileKey: string,
  formData: FormData
) {
  try {
    // Check if the user is signed in; if not, treat as guest
    const userId = await getCurrentUserOrGuestID();

    // Generate public image URL from S3
    const publicImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3FileKey}`;
    await connectToDatabase();

    const newBookmark: ResponseBookmarkData = {
      userId: userId,
      bookmarkName: (formData.get("bookmarkName") as string) || "",
      bookmarkImage: publicImageUrl,
      bookmarkLink: (formData.get("bookmarkLink") as string) || "",
      s3FileKey: s3FileKey,
    };

    const bookmark = new Bookmark(newBookmark);
    await bookmark.validate(); // Validate before saving
    await bookmark.save();

    // Check if user has existing bookmarks in the database
    const userBookmarks = await UserBookmarks.find({ userId });
    if (userBookmarks.length == 0) {
      const newUserBookmarksDocument = new UserBookmarks({
        userId: userId,
        bookmarks: [bookmark._id],
      });
      console.log(newUserBookmarksDocument);
      await newUserBookmarksDocument.save();
    } else {
      await UserBookmarks.updateOne(
        {
          userId: userId,
        },
        {
          $push: {
            bookmarks: bookmark._id,
          },
        }
      );
    }

    // cache the new bookmark in redis
    const redisKey = getRedisBookmarkKey(userId);
    const cachedBookmarks = await getListFromRedis(redisKey);
    const stringifiedBookmark = JSON.stringify(bookmark);

    if (cachedBookmarks) {
      await redis.rpush(redisKey, stringifiedBookmark);
    }

    return {
      mongoDbResponse: newBookmark,
    };
  } catch (e) {
    console.error("Error with uploading to db: " + e);
    return {
      status: "error",
      message: "Error with uploading to DB: " + e,
    };
  }
}
