import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserOrGuestID } from "../../helpers";
import { connectToDatabase } from "@/lib/db";
import { workoutFormSchema } from "@/actions/workoutManager/createWorkout/schema";
import Workout from "@/model/workout";

export async function GET(req: NextRequest) {
  //returns users' workouts from the past year.
  try {
    const userId = await getCurrentUserOrGuestID();
    await connectToDatabase();
    const oneYearAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365);

    const workouts = await Workout.aggregate([
      {
        $match: {
          userId: userId,
          lastUpdated: {
            $gte: oneYearAgo,
          },
        },
      },
      {
        $sort: { lastUpdated: -1 },
      },
      {
        $group: {
          _id: "$workoutName",
          latestWorkout: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$latestWorkout" },
      },
    ]);

    return NextResponse.json(workouts);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
