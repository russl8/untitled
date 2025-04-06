import { z } from "zod";

export type Exercise = {
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  extraInfo: string | "";
};

export type Workout = {
  _id: string;
  workoutName: string;
  exercises: Array<Exercise>;
  lastUpdated: Date;
};

export const exerciseSchema = z.object({
  exerciseName: z.string().min(1, "Required"),
  sets: z.number().min(1, "Must be at least 1"),
  reps: z.number().min(1, "Must be at least 1"),
  weight:z.number().min(0, "Must be a positive number!"),
  extraInfo: z.string().optional().default(""),
});

export const updateFormSchema = z.object({
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
});

export const workoutFormSchema = z.object({
  workoutName: z.string().min(2).max(50),
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
  lastUpdated: z.date({ required_error: "Please pick a date!" }),
});
