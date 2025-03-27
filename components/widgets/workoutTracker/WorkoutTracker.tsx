import { Button } from "@/components/ui/button";
import DisplayLoading from "@/components/widgetDisplay/DisplayLoading";
import { displaySize } from "@/components/widgetDisplay/types";
import { Plus, PlusCircle, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import WorkoutWidgetItem from "./WorkoutWidgetItem";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddWorkoutForm from "./AddWorkoutForm";
import { Workout } from "@/actions/createWorkout/schema";
type WorkoutItem = {
    
}
const WorkoutTracker = ({ displaySize }: { displaySize: displaySize }) => {
    
    const [recentWorkouts, setRecentWorokouts] = useState<Array<Workout>>([])
    const [loading, setLoading] = useState(true);
    console.log(recentWorkouts)
    useEffect(() => {
        setLoading(true)
        fetch("api/workoutTracker")
            .then(res => res.json())
            .then(data => {
                setRecentWorokouts(data.mostRecentWorkouts)
            })
            .catch(error => console.error(error))
        setLoading(false)
    }, [])
    if (loading) return <DisplayLoading />;
    return (
        <div className="flex flex-col items-center justify-center py-4 mt-8">
            <div>
                <p>You havent worked out today!</p>
            </div>


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
                    <AddWorkoutForm />
                </DialogContent>
            </Dialog>

            <div className="flex flex-col">
                {recentWorkouts.map(workout => {
                    return (
                        <WorkoutWidgetItem 
                        workout={workout}
                        key={workout._id}
                         />
                    )
                })}
            </div>
        </div>
    );
}

export default WorkoutTracker;