"use server";
import { z } from "zod";
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

async function createWorkout(values: z.infer<typeof workoutFormSchema>) {
  try {
    const validatedFields = workoutFormSchema.safeParse(values);
    if (validatedFields.error) {
      throw new Error("Invalid fields: " + validatedFields.error);
    }

    const userId = await getCurrentUserOrGuestID();
    await connectToDatabase();
    const workout = {
      ...validatedFields.data,
      userId: userId,
    };
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

export default createWorkout;
