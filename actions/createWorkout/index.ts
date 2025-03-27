"use server";
import { z } from "zod";
import { workoutFormSchema } from "./schema";
import { getCurrentUserOrGuestID } from "@/app/api/helpers";
import Workout from "@/model/workout";
import { connectToDatabase } from "@/lib/db";

async function createWorkout(values: z.infer<typeof workoutFormSchema>) {
  try {
    const validatedFields = workoutFormSchema.safeParse(values);
    if (validatedFields.error) {
      throw new Error("Invalid fields: " + validatedFields.error);
    }

    const user = await getCurrentUserOrGuestID();
    await connectToDatabase();
    const res = await Workout.create({
      ...validatedFields.data,
      lastUpdated: new Date(),
      userId: user,
    });

    return { message: "Workout created successfully!" };
  } catch (e) {
    console.error(e);
    throw new Error("Internal server error: " + e);
  }
}

export default createWorkout;
