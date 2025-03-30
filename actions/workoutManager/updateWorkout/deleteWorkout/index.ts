"use server";

import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import WorkoutTracker from "@/components/widgets/workoutTracker/WorkoutTracker";
import { connectToDatabase } from "@/lib/db";
import Workout from "../../../../model/workout";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export async function deleteWorkout(workoutId: string) {
  try {
    const currentUser = await getCurrentUserOrGuestID();
    await connectToDatabase();
    const currentWorkout = await Workout.findById(workoutId);

    if (currentWorkout.userId !== currentUser)
      throw new Error("Error: invalid user");

    const res = await Workout.findByIdAndDelete(workoutId);

    console.log(res);

    return { message: "Workout deleted successfully" };
  } catch (e) {
    throw new Error("Internal server error: " + e);
  }
}
