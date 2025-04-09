import { connectToDatabase } from "@/lib/db";
import { getCurrentUserOrGuestID } from "../../helpers";
import Workout from "@/model/workout";
import { NextRequest, NextResponse } from "next/server";
import WeeklyReport from "@/components/widgets/workoutTracker/WeeklyReport";
import openai from "@/lib/openai";
import { getOverallSummaryPrompt, getExerciseTipPrompt } from "./prompts";
import { getRedisWeeklyReportKey, redis } from "@/lib/redis";
export async function GET(req: NextRequest) {
  try {
    const aiParam = req.nextUrl.searchParams.get("ai");
    const useAI = aiParam === "true";

    const userId = await getCurrentUserOrGuestID();
    const redisKey = getRedisWeeklyReportKey(userId);

    if (!useAI) {
      const cachedReport = await redis.get(redisKey);
      if (cachedReport) return NextResponse.json(JSON.parse(cachedReport));
    }

    await connectToDatabase();

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const fiveWeeksAgo = new Date(now);
    fiveWeeksAgo.setDate(now.getDate() - 35);

    const thisWeeksWorkouts = await Workout.find({
      userId,
      lastUpdated: { $gte: oneWeekAgo },
    });
    const thisMonthsWorkouts = await Workout.find({
      userId,
      lastUpdated: { $gte: fiveWeeksAgo, $lte: oneWeekAgo },
    });

    const weeklyData: Record<string, any[]> = {};
    const monthlyData: Record<string, any[]> = {};

    // Processing monthly data
    for (const workout of thisMonthsWorkouts) {
      for (const exercise of workout.exercises) {
        const key = `${workout.workoutName}||${exercise.exerciseName}`;
        const entry = {
          reps: exercise.reps,
          weight: exercise.weight,
        };
        if (!monthlyData[key]) monthlyData[key] = [];
        monthlyData[key].push(entry);
      }
    }

    //processing weekly data
    for (const workout of thisWeeksWorkouts) {
      for (const exercise of workout.exercises) {
        const key = `${workout.workoutName}||${exercise.exerciseName}`;
        const entry = {
          reps: exercise.reps,
          weight: exercise.weight,
        };
        if (!weeklyData[key]) weeklyData[key] = [];
        weeklyData[key].push(entry);
      }
    }

    const workoutsReport: WeeklyReport["workouts"] = {};

    for (const key of Object.keys(weeklyData)) {
      const [workoutName, exerciseName] = key.split("||");

      const monthly = monthlyData[key] || [];
      const weekly = weeklyData[key];

      const getAvg = (arr: any[], field: "reps" | "weight") =>
        arr.reduce((sum, item) => sum + item[field], 0) / (arr.length || 1);

      const weeklyRepAverage = getAvg(weekly, "reps");
      const monthlyRepAverage = getAvg(monthly, "reps");

      const weeklyWeightAverage = getAvg(weekly, "weight");
      const monthlyWeightAverage = getAvg(monthly, "weight");

      const repPercentIncrease = monthlyRepAverage
        ? ((weeklyRepAverage - monthlyRepAverage) / monthlyRepAverage) * 100
        : weeklyRepAverage - monthlyRepAverage > 0
        ? 100
        : 0;

      const weightPercentIncrease = monthlyWeightAverage
        ? ((weeklyWeightAverage - monthlyWeightAverage) /
            monthlyWeightAverage) *
          100
        : weeklyWeightAverage - monthlyWeightAverage > 0
        ? 100
        : 0;

      if (!workoutsReport[workoutName]) workoutsReport[workoutName] = {};

      let aiTip = "";
      if (useAI) {
        const aiTipResponse = await openai.responses.create({
          model: process.env.OPENAI_MODEL as string,
          input: getExerciseTipPrompt({
            workoutName,
            exerciseName,
            weeklyRepAverage,
            monthlyRepAverage,
            weeklyWeightAverage,
            monthlyWeightAverage,
            repPercentIncrease,
            weightPercentIncrease,
          }),
        });
        aiTip = aiTipResponse.output_text;
      }
      workoutsReport[workoutName][exerciseName] = {
        weeklyRepAverage,
        monthlyRepAverage,
        weeklyWeightAverage,
        monthlyWeightAverage,
        repPercentIncrease,
        weightPercentIncrease,
        aiGeneratedTip: aiTip,
      };
    }

    // Overall summary
    let aiSummary = "";
    if (useAI) {
      const overallSummaryResponse = await openai.responses.create({
        model: process.env.OPENAI_MODEL as string,
        input: getOverallSummaryPrompt(workoutsReport),
      });
      aiSummary = overallSummaryResponse.output_text;
    }
    const report: WeeklyReport = {
      overallSummary: aiSummary,
      workouts: workoutsReport,
    };

    // store report in cache
    await redis.set(redisKey, JSON.stringify(report));
    return NextResponse.json(report);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error, please try again" },
      { status: 500 }
    );
  }
}
