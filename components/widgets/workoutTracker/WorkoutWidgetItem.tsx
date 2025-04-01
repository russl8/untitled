import { Workout } from "@/actions/workoutManager/createWorkout/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getDayOfWeek, getmmdd } from "@/lib/utils";
import WorkoutDetails from "./WorkoutDetails";
import { deleteWorkout } from "@/actions/workoutManager/deleteWorkout";
import toast from "react-hot-toast";
import { totalmem } from "os";

interface WorkoutwidgetItemProps {
    workout: Workout
    fetchWorkouts: () => void
}

const WorkoutWidgetItem = ({ workout, fetchWorkouts }: WorkoutwidgetItemProps) => {
    const handleDeleteWorkout = (workoutId: string) => {
        deleteWorkout(workoutId)
            .then(_ => {
                toast.success("Workout deleted successfully!")
                fetchWorkouts();
            })
            .catch(err => {
                toast.error(err)
            })
    }
    return (
        <Dialog >

            <TooltipProvider    >
                <Tooltip>
                    <TooltipTrigger >
                        <div className=" py-1 px-4 my-1 rounded-lg  cursor-pointer text-gray-600 hover:bg-white hover:opacity-50">
                            <p>{getmmdd(workout.lastUpdated)}: {workout.workoutName}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={-10} className="m-0 p-0">
                        <div className="flex flex-col p-0 m-0">
                            <DialogTrigger id="workoutDetailsModalTrigger" className="">
                                <div className="h-6 flex justify-center hover:text-gray-400 cursor-pointer px-4 py-2 m-0">View details</div>
                            </DialogTrigger>
                            <div
                                className="h-6 flex justify-center hover:text-gray-400 cursor-pointer mb-2  px-4 py-2 m-0"
                                onClick={() => {
                                    handleDeleteWorkout(workout._id)
                                }}
                            >
                                Delete
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent>
                <DialogHeader>
                    <WorkoutDetails workout={workout} fetchWorkouts={fetchWorkouts} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default WorkoutWidgetItem;