import { Button } from "@/components/ui/button";
import DisplayLoading from "@/components/widgetDisplay/DisplayLoading";
import { displaySize } from "@/components/widgetDisplay/types";
import { Plus, PlusCircle, ReceiptText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import WorkoutWidgetItem from "./WorkoutWidgetItem";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddWorkoutForm from "./AddWorkoutForm";
import { Workout } from "@/actions/createWorkout/schema";
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
        <div className="flex flex-col px-10 items-center h-full ">
            <div>
                <p>This week:</p>

                <div>
                    2 workout days
                </div>

                <div>
                    Pull:2 Goal: 2
                </div>

                <div>
                Push: 1 Goal: 1
                </div>

                <div>
                Legs: 1 Goal: 1

                </div>
            </div>



            <div className="flex flex-col items-center justify-center bg-amber-100 h-full">

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
        </div>
    );
}

export default WorkoutTracker;