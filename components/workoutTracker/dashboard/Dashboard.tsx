import { Button } from "@/components/ui/button";
import DisplayLoading from "@/components/widgetDisplay/DisplayLoading";
import { displaySize } from "@/components/widgetDisplay/types";
import { LucideBook, PencilLineIcon, Plus, PlusCircle, ReceiptText } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddWorkoutForm from "../add-workout/AddWorkoutForm";
import { Workout } from "@/actions/workoutManager/createWorkout/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scrollarea"
import WorkoutCard from "./WorkoutCard";
import { cn, getmmdd } from "@/lib/utils";
import WeeklyReport from "../weekly-report/WeeklyReport";
import FrequencyChart, { FrequencyChartData } from "../frequency-chart/FrequencyChart";

type WorkoutItem = {

}
const Dashboard = ({  }: {  }) => {
    const [recentWorkouts, setRecentWorkouts] = useState<Array<Workout>>([])
    const [chartData, setChartData] = useState<FrequencyChartData>([])
    const [loading, setLoading] = useState(true);
    const fetchWorkouts = useCallback(() => {
        fetch("api/workoutTracker/getRecentWorkouts")
            .then(res => res.json())
            .then(data => {
                setRecentWorkouts(data.mostRecentWorkouts)
            })
            .catch(error => console.error(error))
            .finally(() => {
                if (loading) setLoading(false)
            });
    }, [])
    
    useEffect(() => {
        fetchWorkouts()
    }, [])

    // repopulate chart data only when the most recent workouts change.
    useEffect(() => {
        fetch("api/workoutTracker/getThisWeeksWorkouts")
            .then(res => res.json())
            .then(data => {
                // init chartData as a map with mm/dd: numberOfWorkoutsThatDay
                const workoutsForEachDay: { [key: string]: number } = {}
                for (let i = 6; i >= 0; i--) {
                    workoutsForEachDay[`${getmmdd(new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000))}`] = 0
                }

                for (const workout of data.mostRecentWorkouts) {
                    const workoutDate: Date = new Date(workout.lastUpdated)
                    workoutsForEachDay[getmmdd(workoutDate)] += 1
                }

                const res: Array<{ day: string, workouts: number }> = []
                for (const [key, value] of Object.entries(workoutsForEachDay)) {
                    res.push({ day: key, workouts: value })
                }
                setChartData(res)
            })
            .catch(error => console.error(error))
    }, [recentWorkouts])


    if (loading) return (
        <div className="h-full w-full flex items-center justify-center">
            Loading...
        </div>
    );

    return (
        <div className="flex flex-col justify-around items-center h-full">
            <div className="h-full w-full flex flex-col align-top">
                <div className={cn("flex flex-col justify-between  border-b-1 border-lusion-lightgray",
                    "",
                )}>
                    <Dialog >
                        <DialogTrigger id="addWorkoutModalTrigger" className="mb-2">
                            <div className="flex items-center justify-center w-32 h-10 py-2 px-4 cursor-pointer border border-input bg-background shadow-xs hover:bg-accent rounded-md hover:text-accent-foreground">
                                <PlusCircle className="mr-2" />
                                <p>Add</p>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add workout</DialogTitle>
                            </DialogHeader>
                            <AddWorkoutForm fetchWorkouts={fetchWorkouts} />
                        </DialogContent>
                    </Dialog>


                    <Dialog >
                        <DialogTrigger id="addWorkoutModalTrigger" className="mb-2">
                            <FrequencyChart
                                frequencyChartData={chartData}
                            />
                        </DialogTrigger>
                        <DialogContent className="max-h-[80%] overflow-auto">
                            <DialogHeader>
                                <DialogTitle>Weekly Report</DialogTitle>
                            </DialogHeader>
                            <WeeklyReport />
                        </DialogContent>
                    </Dialog>
                </div>

                <ScrollArea className="flex whitespace-nowrap rounded-md border-none text-white">
                    <div className={cn("grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4")}>
                        {recentWorkouts.map(workout => {
                            return (
                                <div key={workout._id} className="flex justify-center items-center">
                                    <WorkoutCard
                                        fetchWorkouts={fetchWorkouts}
                                        workout={workout}
                                    />
                                </div>

                            )
                        })}
                        {recentWorkouts.map(workout => {
                            return (
                                <div key={workout._id} className="flex justify-center items-center">
                                    <WorkoutCard
                                        fetchWorkouts={fetchWorkouts}
                                        workout={workout}
                                    />
                                </div>

                            )
                        })}
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>

            </div>


        </div >
    );
}

export default Dashboard;