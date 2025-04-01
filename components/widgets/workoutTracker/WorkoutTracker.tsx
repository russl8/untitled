import { Button } from "@/components/ui/button";
import DisplayLoading from "@/components/widgetDisplay/DisplayLoading";
import { displaySize } from "@/components/widgetDisplay/types";
import { Plus, PlusCircle, ReceiptText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import WorkoutWidgetItem from "./WorkoutWidgetItem";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddWorkoutForm from "./AddWorkoutForm";
import { Workout } from "@/actions/workoutManager/createWorkout/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scrollarea"

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
        <div className="flex flex-col justify-around px-5 items-center h-full">
            <ScrollArea className="w-full h-20 whitespace-nowrap rounded-md border-none text-white">
                <div className="w-full flex flex-row justify-center items-center">
                    <div className="w-[50px] h-[50px] bg-red-200 mx-1">
                        <p>Mon</p>
                        <div>Push</div>
                    </div>
                    <div className="w-[50px] h-[50px] bg-red-200 mx-1">
                        <p>Mon</p>
                        <div>Push</div>
                    </div>
                    <div className="w-[50px] h-[50px] bg-red-200 mx-1">
                        <p>Mon</p>
                        <div>Push</div>
                    </div>
                    <div className="w-[50px] h-[50px] bg-red-200 mx-1">
                        <p>Mon</p>
                        <div>Push</div>
                    </div>
                    <div className="w-[50px] h-[50px] bg-red-200 mx-1">
                        <p>Mon</p>
                        <div>Push</div>
                    </div>
                    <div className="w-[50px] h-[50px] bg-red-200 mx-1">
                        <p>Mon</p>
                        <div>Push</div>
                    </div>
                    <div className="w-[50px] h-[50px] bg-red-200 mx-1">
                        <p>Mon</p>
                        <div>Push</div>
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>


            <div className="flex flex-col items-center justify-center h-full">

                <Dialog >
                    <DialogTrigger id="addWorkoutModalTrigger" className="my-2">
                        <div className="flex flex-row py-2 px-2 cursor-pointer border border-input bg-background shadow-xs hover:bg-accent rounded-md hover:text-accent-foreground">
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

                <div className="flex flex-col">
                    {recentWorkouts.map(workout => {
                        return (
                            <WorkoutWidgetItem
                                fetchWorkouts={fetchWorkouts}
                                workout={workout}
                                key={workout._id}
                            />
                        )
                    })}
                </div>
            </div>
        </div >
    );
}

export default WorkoutTracker;