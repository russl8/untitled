import { Button } from "@/components/ui/button";
import DisplayLoading from "@/components/widgetDisplay/DisplayLoading";
import { displaySize } from "@/components/widgetDisplay/types";
import { Plus, PlusCircle, ReceiptText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddWorkoutForm from "./AddWorkoutForm";
import { Workout } from "@/actions/workoutManager/createWorkout/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scrollarea"
import WorkoutCard from "./WorkoutCard";
import { cn } from "@/lib/utils";

type WorkoutItem = {

}
const WorkoutTracker = ({ displaySize }: { displaySize: displaySize }) => {

    const [recentWorkouts, setRecentWorkouts] = useState<Array<Workout>>([])
    const [loading, setLoading] = useState(true);
    const fetchWorkouts = useCallback(() => {
        fetch("api/workoutTracker")
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
    if (loading) return <DisplayLoading />;
    return (
        <div className="flex flex-col justify-around items-center h-full">
            <div className="h-full w-full flex flex-col align-top">
                <div className="flex">
                    <Dialog >
                        <DialogTrigger id="addWorkoutModalTrigger" className="mb-2">
                            <div className="flex flex-row w-40 text-center h-10 py-2 px-2 cursor-pointer border border-input bg-background shadow-xs hover:bg-accent rounded-md hover:text-accent-foreground">
                                <PlusCircle className="mr-2" />
                                <p>Add a workout</p>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add workout</DialogTitle>
                            </DialogHeader>
                            <AddWorkoutForm fetchWorkouts={fetchWorkouts} />
                        </DialogContent>
                    </Dialog>

                    <div className="w-full ml-4 h-14 text-sm  overflow-hidden">
                        <h2 className="font-bold  text-md">This week: </h2>
                    </div>

                </div>

                <ScrollArea className="flex whitespace-nowrap rounded-md border-none text-white">
                    <div className={cn("", {
                        "w-full flex flex-row justify-center items-center": displaySize === "quartersize",
                        "grid grid-cols-3": displaySize === "halfsize",
                        "grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4": displaySize === "fullsize"

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