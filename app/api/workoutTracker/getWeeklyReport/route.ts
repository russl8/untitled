import { connectToDatabase } from "@/lib/db";
import { getCurrentUserOrGuestID } from "../../helpers";
import Workout from "@/model/workout";
import { NextResponse } from "next/server";
import WeeklyReport from "@/components/widgets/workoutTracker/WeeklyReport";
import openai from "@/lib/openai";
import { getOverallSummaryPrompt, getExerciseTipPrompt } from "./prompts";
export async function GET() {
  try {
    await connectToDatabase();
    const userId = await getCurrentUserOrGuestID();

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
      workoutsReport[workoutName][exerciseName] = {
        weeklyRepAverage,
        monthlyRepAverage,
        weeklyWeightAverage,
        monthlyWeightAverage,
        repPercentIncrease,
        weightPercentIncrease,
        aiGeneratedTip: aiTipResponse.output_text,
      };
    }

    // Overall summary
    const overallSummaryResponse = await openai.responses.create({
      model: process.env.OPENAI_MODEL as string,
      input: getOverallSummaryPrompt(workoutsReport),
    });
    const report: WeeklyReport = {
      overallSummary: overallSummaryResponse.output_text,
      workouts: workoutsReport,
    };

    return NextResponse.json(report);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error, please try again" },
      { status: 500 }
    );
  }
}
