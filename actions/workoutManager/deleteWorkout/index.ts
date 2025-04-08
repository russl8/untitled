"use server";

import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import WorkoutTracker from "@/components/widgets/workoutTracker/WorkoutTracker";
import { connectToDatabase } from "@/lib/db";
import { getRedisWeeklyReportKey, getRedisWorkoutKey, redis } from "@/lib/redis";
import Workout from "@/model/workout";

export async function deleteWorkout(workoutId: string) {
  try {
    const userId = await getCurrentUserOrGuestID();
    await connectToDatabase();
    const currentWorkout = await Workout.findById(workoutId);

    if (currentWorkout.userId !== userId)
      throw new Error("Error: invalid user");

    const res = await Workout.findByIdAndDelete(workoutId);

    const cacheWorkoutKey= getRedisWorkoutKey(userId);
    const cacheWeeklyreportKey = getRedisWeeklyReportKey(userId);
    await redis.del(cacheWeeklyreportKey);
    await redis.del(cacheWorkoutKey);

    return { message: "Workout deleted successfully" };
  } catch (e) {
    throw new Error("Internal server error: " + e);
  }
}
