import { Workout } from "@/actions/workoutManager/createWorkout/schema";
import { deleteWorkout } from "@/actions/workoutManager/deleteWorkout";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scrollarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getmmdd } from "@/lib/utils";
import toast from "react-hot-toast";
import WorkoutDetails from "../details/WorkoutDetails";
import { displaySize } from "@/components/widgetDisplay/types";
import { displays } from "@/lib/constants";
import { useMemo } from "react";


interface WorkoutCardProps {
    workout: Workout
    fetchWorkouts: () => void
}

const TITLE_TRIM_AMOUNT = 12;
const WorkoutCard = ({ workout, fetchWorkouts }: WorkoutCardProps) => {
    const handleDeleteWorkout = (workoutId: string) => {
        deleteWorkout(workoutId)
            .then(() => {
                toast.success("Workout deleted successfully!");
            })
            .catch(err => {
                toast.error(err);
            })
            .finally(() => {
                fetchWorkouts();
            })
    };

    return (
        <Dialog>
            <TooltipProvider>
                <Tooltip>

                    <DialogTrigger id="workoutDetailsModalTriggerClick"  className="workoutCard">
                        <TooltipTrigger asChild>

                        <div
                            className={cn(
                                `group hover:scale-105 bg-white text-black rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer 
                                 overflow-hidden select-none px-4 py-3 m-2 flex flex-col justify-between w-[160px] h-[220px] text-sm`,

                            )}
                        >
                            <div className="flex text-sm justify-between items-center font-semibold text-gray-800 mb-2">
                                <p className="truncate w-[70%]">
                                    {workout.workoutName.slice(0, TITLE_TRIM_AMOUNT)}
                                    {workout.workoutName.length > TITLE_TRIM_AMOUNT && "..."}
                                </p>
                                <span className="text-xs text-gray-500">{getmmdd(workout.lastUpdated)}</span>
                            </div>

                            <div className="flex-1 overflow-y-scroll">
                                {workout.exercises.map((exercise, index) => (
                                    <div key={index} className="flex justify-between items-center text-gray-700 py-[1px]">
                                        <span className="truncate">
                                            {exercise.exerciseName.slice(0, 11)}
                                            {exercise.exerciseName.length > 11 && "..."}
                                        </span>
                                        <span className="font-semibold">{exercise.reps}x{exercise.sets}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        </TooltipTrigger>

                    </DialogTrigger>


                    <TooltipContent sideOffset={-10} className="p-0">
                        <div className="flex flex-col text-sm">
                            <DialogTrigger id="workoutDetailsModalTriggerTooltip">
                                <div className=" hover:opacity-80 cursor-pointer px-4 py-2">View details</div>
                            </DialogTrigger>
                            <div
                                className="hover:opacity-80 cursor-pointer px-4 py-2"
                                onClick={() => handleDeleteWorkout(workout._id)}
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
};
export default WorkoutCard;