import { Button } from "@/components/ui/button";
import DisplayLoading from "@/components/widgetDisplay/DisplayLoading";
import { displaySize } from "@/components/widgetDisplay/types";
import { LucideBook, PencilLineIcon, Plus, PlusCircle, ReceiptText } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddWorkoutForm from "./AddWorkoutForm";
import { Workout } from "@/actions/workoutManager/createWorkout/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scrollarea"
import WorkoutCard from "./WorkoutCard";
import { cn, getmmdd } from "@/lib/utils";
import WeeklyReport from "./WeeklyReport";
import FrequencyChart, { FrequencyChartData } from "./FrequencyChart";

type WorkoutItem = {

}
const WorkoutTracker = ({ displaySize }: { displaySize: displaySize }) => {

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


    if (loading) return <DisplayLoading />;

    return (
        <div className="flex flex-col justify-around items-center h-full">
            <div className="h-full w-full flex flex-col align-top">
                <div className="flex justify-between  border-b-1 border-lusion-lightgray">
                    <Dialog >
                        <DialogTrigger id="addWorkoutModalTrigger" className="mb-2">
                            <div className="flex items-center h-10 py-2 px-4 cursor-pointer border border-input bg-background shadow-xs hover:bg-accent rounded-md hover:text-accent-foreground">
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
                                displaySize={displaySize}
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
                    <div className={cn("", {
                        "w-full flex flex-row justify-center items-center": displaySize === "quartersize",
                        "grid grid-cols-1 lg:grid-cols-3": displaySize === "halfsize",
                        "grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4": displaySize === "fullsize"

                    })}>
                        {recentWorkouts.map(workout => {
                            return (
                                <div key={workout._id} className="flex justify-center items-center">
                                    <WorkoutCard
                                        fetchWorkouts={fetchWorkouts}
                                        workout={workout}
                                        displaySize={displaySize}
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
                                        displaySize={displaySize}
                                    />
                                </div>

                            )
                        })}
                    </div>
                    <ScrollBar orientation={displaySize === "quartersize" ? "horizontal" : "vertical"} />
                </ScrollArea>

            </div>


        </div >
    );
}

export default WorkoutTracker;