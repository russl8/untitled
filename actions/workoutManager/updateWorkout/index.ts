"use server";
import { z } from "zod";
import { updateFormSchema } from "@/actions/workoutManager/createWorkout/schema";
import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import Workout from "@/model/workout";
import { connectToDatabase } from "@/lib/db";
import { getRedisWorkoutKey, redis } from "@/lib/redis";
const updateWorkout = async (
  values: z.infer<typeof updateFormSchema>,
  workoutId: string
) => {
  try {
    const validatedFields = updateFormSchema.safeParse(values);
    if (validatedFields.error) {
      throw new Error("Invalid fields: " + validatedFields.error);
    }

    await connectToDatabase();

    const userId = await getCurrentUserOrGuestID();

    const workout = await Workout.findById(workoutId);

    if (workout.userId !== userId) throw new Error("Incorrect user!");

    const res = await Workout.updateOne(
      {
        _id: workoutId,
      },
      { $set: { exercises: values.exercises } }
    );

    const cacheWorkoutKey = getRedisWorkoutKey(userId);
    const cacheWeeklyreportKey = getRedisWeeklyReportKey(userId);
    await redis.del(cacheWeeklyreportKey);
    await redis.del(cacheWorkoutKey);

    return { message: "Workout updated successfully!" };
  } catch (e) {
    console.error(e);
    throw new Error("Internal server error: " + e);
  }
};
export default updateWorkout;
