import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  workoutName: {
    type: String,
    required: true,
  },
  exercises: {
    type: Array<{
      exerciseName: String;
      sets: Number;
      reps: Number;
      extraInfo: String;
    }>,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
});

const Workout =
  mongoose.models.Workout || mongoose.model("Workout", WorkoutSchema);

export default Workout;
