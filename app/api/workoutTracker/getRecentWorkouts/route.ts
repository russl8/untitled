import { connectToDatabase } from "@/lib/db";
import { getCurrentUserOrGuestID } from "../../helpers";
import Workout from "@/model/workout";
import { NextResponse } from "next/server";
import { addArrayToRedisKey, getListFromRedis, getRedisWorkoutKey } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserOrGuestID();
    const redisKey = getRedisWorkoutKey(userId);

    const cachedWorkouts = await getListFromRedis(redisKey);
    console.log(cachedWorkouts);
    if (cachedWorkouts.length > 0)
      return NextResponse.json({ mostRecentWorkouts: cachedWorkouts });

    await connectToDatabase();

    const mostRecentWorkouts = await Workout.find({ userId })
      .sort({ lastUpdated: -1 })
      .exec();

    await addArrayToRedisKey(redisKey,mostRecentWorkouts)
    
    return NextResponse.json({ mostRecentWorkouts }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error, please try again" },
      { status: 500 }
    );
  }
}
