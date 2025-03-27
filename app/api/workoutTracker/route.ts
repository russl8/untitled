import { connectToDatabase } from "@/lib/db";
import { getCurrentUserOrGuestID } from "../helpers";
import Workout from "@/model/workout";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const userId = await getCurrentUserOrGuestID();

    const mostRecentWorkouts = await Workout.find({ userId })
      .sort({ lastUpdated: -1 })
      .limit(5)
      .exec();

    return NextResponse.json({  mostRecentWorkouts }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error, please try again" },
      { status: 500 }
    );
  }
}
