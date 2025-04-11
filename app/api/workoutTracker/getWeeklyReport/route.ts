import { connectToDatabase } from "@/lib/db";
import { getCurrentUserOrGuestID } from "../../helpers";
import Workout from "@/model/workout";
import { NextRequest, NextResponse } from "next/server";
import WeeklyReport from "@/components/widgets/workoutTracker/WeeklyReport";
import openai from "@/lib/openai";
import { getOverallSummaryPrompt, getExerciseTipPrompt } from "./prompts";
import {
  getRedisWeeklyReportKey,
  redis,
  getWeeklyReportRateKey,
} from "@/lib/redis";
import { getReport } from "./getReport";
import { RateLimitError } from "openai";
const LIMIT = 2;
const LIMIT_DURATION = 300;
export async function GET(req: NextRequest) {
  try {
    const useAI = req.nextUrl.searchParams.get("ai") === "true";

    const userId = await getCurrentUserOrGuestID();
    const redisWeeklyReportKey = getRedisWeeklyReportKey(userId);
    const redisRateLimiterKey = getWeeklyReportRateKey(userId);

    /**
     * If user wants to use ai,
     *  - see if user has surpassed rate limit. if so, return.
     *
     * If use is not using ai (ie: just opening the weekly report)
     *  then check cache for previously generated previous report (regardless if it was ai generated)
     */
    if (useAI) {
      const cachedRate = await redis.get(redisRateLimiterKey);
      const rate: number = parseInt(cachedRate || "0");
      const ttl = await redis.ttl(redisRateLimiterKey);

      if (rate >= LIMIT) {
        return NextResponse.json(
          {
            error:
              `Too many requests in a short period of time. Please try again in ${Math.floor(ttl/60)}min!`,
          },
          { status: 403 }
        );
      }
      redis.set(redisRateLimiterKey, (rate + 1).toString());
      //set expiry of rate limiter value if it is just being initialized.
      if (cachedRate === null) {
        redis.expire(redisRateLimiterKey, LIMIT_DURATION);
      } else {
        redis.expire(redisRateLimiterKey, ttl);
      }
    } else {
      const cachedReport = await redis.get(redisWeeklyReportKey);
      if (cachedReport) return NextResponse.json(JSON.parse(cachedReport));
    }

    //connect to db, and generate a new report
    await connectToDatabase();
    const report = await getReport(useAI, userId);

    // store report in cache
    await redis.set(redisWeeklyReportKey, JSON.stringify(report));
    return NextResponse.json(report);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error, please try again" },
      { status: 500 }
    );
  }
}
