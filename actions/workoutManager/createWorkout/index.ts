"use server";
import { z } from "zod";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { workoutFormSchema } from "./schema";
import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import Workout from "@/model/workout";
import { connectToDatabase } from "@/lib/db";
import {
  addArrayToRedisKey,
  getListFromRedis,
  getRedisWeeklyReportKey,
  getRedisWorkoutKey,
  redis,
} from "@/lib/redis";
import { VALID_LOADERS } from "next/dist/shared/lib/image-config";
import { nanoid } from "nanoid";

async function createWorkout(values: z.infer<typeof workoutFormSchema>) {
  try {
    const validatedFields = workoutFormSchema.safeParse(values);
    if (validatedFields.error) {
      throw new Error("Invalid fields: " + validatedFields.error);
    }

    const userId = await getCurrentUserOrGuestID();
    await connectToDatabase();

    // UPLOAD IMAGE TO S3
    let s3FileKey = null;
    let workoutImageLink = null;
    if (validatedFields.data.workoutImage) {
      const uploadImageResponse = await uploadImageToS3(
        validatedFields.data.workoutImage
      );
      s3FileKey = uploadImageResponse.s3FileKey;
      if (!s3FileKey || s3FileKey === "") {
        const error = "Missing S3 file key";
        console.error(error);
        return {
          status: "error",
          message: error,
        };
      }
      workoutImageLink = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3FileKey}`;
    }

    const newWorkout = {
      ...validatedFields.data,
      userId: userId,
      s3FileKey,
      workoutImageLink,
    };
    const workout = new Workout(newWorkout);
    await Workout.validate(workout);
    await Workout.create(workout);

    // clear cache,
    // since we want to replace entire list since the date can affect order of workouts
    // and want to prevent client-side sorting for now
    const cacheWorkoutKey = getRedisWorkoutKey(userId);
    const cacheWeeklyreportKey = getRedisWeeklyReportKey(userId);
    await redis.del(cacheWeeklyreportKey);
    await redis.del(cacheWorkoutKey);

    return { message: "Workout created successfully!" };
  } catch (e) {
    console.error(e);
    throw new Error("Internal server error: " + e);
  }
}

async function uploadImageToS3(image: Blob) {
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
    formDataForS3.append("file", image);
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

export default createWorkout;
