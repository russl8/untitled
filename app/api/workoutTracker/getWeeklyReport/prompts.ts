import WeeklyReport from "@/components/workoutTracker/weekly-report/WeeklyReport";

export const getOverallSummaryPrompt = (
  userWorkoutReport: WeeklyReport["workouts"]
): string => {
  const res = `
  You are a fitness assistant that generates a 2–4 sentence summary for a user that is using a fitness tracker app.
  
  You will be provided a report listing all the workouts they have done this week, along with their average reps and weights.

  If you notice that most of their workouts are bodyweight, suggest only body weight workouts.
  
  Don't use markdown.

  In your summary, please talk about the following:
  
  1. Workouts or muscle groups that they should consider adding to their routine (based on missing variety or balance).
  2. Notable improvements in performance — such as increase in reps, weight, or workout consistency.
  3. Encouraging feedback or a motivational comment based on their progress this week.
  
  Here is the user's weekly workout data:
  
  ${JSON.stringify(userWorkoutReport, null, 2)}
    `;
  return res;
};

export const getExerciseTipPrompt = (userWorkoutStats: {
  workoutName: string;
  exerciseName: string;
  weeklyRepAverage: number;
  monthlyRepAverage: number;
  weeklyWeightAverage: number;
  monthlyWeightAverage: number;
  repPercentIncrease: number;
  weightPercentIncrease: number;
}): string => {
  const statsString = JSON.stringify(userWorkoutStats, null, 2);

  const res = `
  You are a smart fitness assistant that generates a single helpful, actionable sentence (less than 30 words) of advice for a user based on their exercise stats in a fitness tracker app.
  
  You will be given data for one specific exercise, including its name, and the user's average reps and weight over the past week and month.
  
  In your tip, you should:
  
  1. Identify the exercise type (e.g., bodyweight, machine, free weight, compound, etc.) based on its name if possible.
  2. Analyze the user's progress: 
     - If performance is plateauing or decreasing, suggest strategies for breaking through (e.g., progressive overload, rest, or variation).
     - If there's rapid progress, advise caution and possible deloading or recovery routines.
     - If it’s a stabilizing/mobility/core exercise, consider recommending complementary stretches or mobility work.
  
  Here is the user's exercise data:
  
  ${statsString}
    `;
  return res;
};
