import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";


type WorkoutStats = {

    weeklyRepAverage: number;
    monthlyRepAverage: number;
    weeklyWeightAverage: number;
    monthlyWeightAverage: number;
    repPercentIncrease: number;
    weightPercentIncrease: number;
    aiGeneratedTip: string;
};


type WeeklyReport = {
    userSummary: {
        profile: string;
        overallSummary: string;
    };
    workouts: {
        [workoutName: string]: {
            [exerciseName: string]: WorkoutStats
        }
    };
};


const sampleWeeklyReport: WeeklyReport = {
    userSummary: {
        profile: "Enjoys calisthenics as opposed to traditional weight-lifting at the gym. Works out 5 times a week.",
        overallSummary:
            "This is a well-structured calisthenics routine that covers all major muscle groups with progressive overload in key exercises like pullups, dips, and pistol squats. You're seeing consistent strength improvements across upper and lower body movements. However, try mixing in some cardio 1–2 times a week—such as jump rope, light jogging, or HIIT—to improve your cardiovascular endurance!"
    },
    workouts: {
        pull: {
            pullups: {
                weeklyRepAverage: 7,
                monthlyRepAverage: 8,
                weeklyWeightAverage: 12,
                monthlyWeightAverage: 0,
                repPercentIncrease: 14,
                weightPercentIncrease: 100,
                aiGeneratedTip: "It seems like you are quickly increasing the weight of your pullups. Take care of your elbows by warming them up beforehand."
            },
            invertedRows: {
                weeklyRepAverage: 10,
                monthlyRepAverage: 9,
                weeklyWeightAverage: 0,
                monthlyWeightAverage: 0,
                repPercentIncrease: 11,
                weightPercentIncrease: 0,
                aiGeneratedTip: "Nice progress on your rows! Try elevating your feet slightly for added resistance."
            },
            chinups: {
                weeklyRepAverage: 6,
                monthlyRepAverage: 5,
                weeklyWeightAverage: 10,
                monthlyWeightAverage: 8,
                repPercentIncrease: 20,
                weightPercentIncrease: 25,
                aiGeneratedTip: "Adding chin-ups helps improve bicep strength and complements your pullup gains."
            }
        },
        push: {
            pushups: {
                weeklyRepAverage: 20,
                monthlyRepAverage: 18,
                weeklyWeightAverage: 0,
                monthlyWeightAverage: 0,
                repPercentIncrease: 10,
                weightPercentIncrease: 0,
                aiGeneratedTip: "You could increase the difficulty with elevated or pseudo-planche pushups."
            },
            dips: {
                weeklyRepAverage: 10,
                monthlyRepAverage: 9,
                weeklyWeightAverage: 8,
                monthlyWeightAverage: 6,
                repPercentIncrease: 12,
                weightPercentIncrease: 33,
                aiGeneratedTip: "Strong dip numbers! Consider working on range of motion for shoulder health."
            },
            pikePushups: {
                weeklyRepAverage: 8,
                monthlyRepAverage: 8,
                weeklyWeightAverage: 0,
                monthlyWeightAverage: 0,
                repPercentIncrease: 0,
                weightPercentIncrease: 0,
                aiGeneratedTip: "Pike pushups are great for shoulder strength. Gradually work toward handstand pushups."
            }
        },
        legs: {
            pistolSquats: {
                weeklyRepAverage: 6,
                monthlyRepAverage: 5,
                weeklyWeightAverage: 0,
                monthlyWeightAverage: 0,
                repPercentIncrease: 20,
                weightPercentIncrease: 0,
                aiGeneratedTip: "Keep working on balance and depth for even more gains from pistol squats."
            },
            jumpSquats: {
                weeklyRepAverage: 15,
                monthlyRepAverage: 13,
                weeklyWeightAverage: 0,
                monthlyWeightAverage: 0,
                repPercentIncrease: 15,
                weightPercentIncrease: 0,
                aiGeneratedTip: "Jump squats are a great plyometric addition. Maintain form to protect your knees."
            }
        },
        core: {
            hangingLegRaises: {
                weeklyRepAverage: 12,
                monthlyRepAverage: 10,
                weeklyWeightAverage: 0,
                monthlyWeightAverage: 0,
                repPercentIncrease: 20,
                weightPercentIncrease: 0,
                aiGeneratedTip: "Great job! Focus on slow, controlled movement to maximize engagement."
            },
            lsits: {
                weeklyRepAverage: 20, // seconds
                monthlyRepAverage: 15,
                weeklyWeightAverage: 0,
                monthlyWeightAverage: 0,
                repPercentIncrease: -33,
                weightPercentIncrease: 0,
                aiGeneratedTip: "Nice improvement! Keep toes pointed and shoulders depressed for better form."
            }
        }
    }
};



const WeeklyReport = () => {
    const [weeklyReportData, setWeeklyReportData] = useState()
    // useEffect(() => {
    //     fetch("api/workoutTracker/getWeeklyReport")
    //         .then(res => res.json())
    //         .then(data => setWeeklyReportData(data.weeklyReport))
    //         .catch(error => console.error(error))
    // }, [])

    return (
        <div className="w-full">
            <h2 className="font-bold underline">Summary</h2>
            <p className="text-sm mb-4">{sampleWeeklyReport.userSummary.overallSummary}</p>
            <h2 className="font-bold underline">Excercise Recap</h2>
            <div className="w-full grid gap-y-2 grid-cols-7 text-sm">
                {/* COLUMN HEADERS */}
                <div className="col-span-2 font-semibold">
                    Exercise
                </div>
                <div className="col-span-1 font-semibold">
                    Rep avg.
                </div>
                <div className="col-span-1 font-semibold">
                    Weight avg.
                </div>
                <div className="col-span-3 font-semibold">
                    Tip
                </div>
                {Object.keys(sampleWeeklyReport.workouts).map(workout => (
                    <div className="contents" key={workout} id={workout}>
                        <h1 className="col-span-full border-b-1 border-lusion-gray">{workout}</h1>
                        {Object.keys(sampleWeeklyReport.workouts[workout]).map(exerciseName => {
                            const exercise = sampleWeeklyReport.workouts[workout][exerciseName]
                            return (
                                <div key={exerciseName} className="contents">
                                    <div className="col-span-2 overflow-hidden">{exerciseName}</div>
                                    <StatPercentage
                                        average={exercise.weeklyRepAverage}
                                        percentIncrease={exercise.repPercentIncrease}
                                    />

                                    <StatPercentage
                                        average={exercise.weeklyWeightAverage}
                                        percentIncrease={exercise.weightPercentIncrease}
                                    />

                                    <div className="col-span-3 text-xs">{exercise.aiGeneratedTip}</div>
                                </div>
                            )
                        }
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}


const StatPercentage = ({ average, percentIncrease }: { average: number, percentIncrease: number }) => {
    return (
        <div className="flex col-span-1 overflow-hidden">
            <p>{average}</p>
            <div className="flex text-center text-xs ml-[-6px]">
                <div className={cn("mr-[-6px]", {
                    "text-lusion-lightgray": percentIncrease === 0,
                    "text-green-800": percentIncrease > 0,
                    "text-red-800": percentIncrease < 0
                })}>
                    {percentIncrease === 0 ?
                        <MinusIcon height={15} />
                        :
                        percentIncrease > 0 ?
                            <ArrowUp height={15} />
                            :
                            <ArrowDown height={15} />}

                </div>
                <p className={cn("", {
                    "text-lusion-lightgray": percentIncrease === 0,
                    "text-green-800": percentIncrease > 0,
                    "text-red-800": percentIncrease < 0
                })}>{percentIncrease}%</p>
            </div>
        </div>
    )
}

export default WeeklyReport;