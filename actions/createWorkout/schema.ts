import { z } from "zod";

export type Exercise = {
  exerciseName: string;
  sets: number;
  reps: number;
  extraInfo: string | "";
};

export type Workout = {
  _id: string;
  workoutName: string;
  exercises: Array<Exercise>;
  lastUpdated:Date
};

export const exerciseSchema = z.object({
  exerciseName: z.string().min(1, "Required"),
  sets: z.number().min(1, "Must be at least 1"),
  reps: z.number().min(1, "Must be at least 1"),
  extraInfo: z.string().optional().default(""),
});

export const workoutFormSchema = z.object({
  workoutName: z.string().min(2).max(50),
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
});
