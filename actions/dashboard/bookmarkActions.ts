"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { nanoid } from "nanoid";
import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import Bookmark from "@/Model/bookmark";

export async function createBookmark(formData: FormData) {
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

    try {
      await mongoose.connect(process.env.MONGODB_URI || "", {
        dbName: "untitled",
      });
    } catch (e) {
      return {
        error: "Could not connect to mongodb.",
      };
    }
    const newBookmark = await Bookmark.create({
      userId,
      bookmarkName: formData.get("bookmarkName"),
      bookmarkImage: publicImageUrl,
      bookmarkLink: formData.get("bookmarkLink"),
    });

    revalidatePath("/api/dashboard/bookmarkManager");
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
