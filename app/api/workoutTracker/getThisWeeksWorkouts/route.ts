import { connectToDatabase } from "@/lib/db";
import { getCurrentUserOrGuestID } from "../../helpers";
import Workout from "@/model/workout";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const userId = await getCurrentUserOrGuestID();

    // console.log( new Date() - 7 * 24 * 60 * 60 * 1000)
    const mostRecentWorkouts = await Workout.aggregate([
      {
        $match: {
          userId: userId,
          lastUpdated: {
            $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
    ]).project({ lastUpdated: 1 });

    return NextResponse.json({ mostRecentWorkouts }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal server error, please try again" },
      { status: 500 }
    );
  }
}
