import { Workout } from "@/actions/workoutManager/createWorkout/schema";
import { deleteWorkout } from "@/actions/workoutManager/deleteWorkout";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scrollarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getmmdd } from "@/lib/utils";
import toast from "react-hot-toast";
import WorkoutDetails from "./WorkoutDetails";
import { displaySize } from "@/components/widgetDisplay/types";
import { displays } from "@/lib/constants";
import { useMemo } from "react";


interface WorkoutCardProps {
    workout: Workout
    fetchWorkouts: () => void
    displaySize: displaySize
}
const WorkoutCard = ({ workout, fetchWorkouts, displaySize }: WorkoutCardProps) => {
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
    const titleTrimAmount = useMemo(() => {
        if (displaySize === 'fullsize') {
            return 8
        } else {
            return 5
        }
    }, [displaySize])
    return (
        //TODO: make more responsive, bookmark use shopify-draggable and hover animations

        <Dialog >
            <TooltipProvider    >
                <Tooltip>
                    <TooltipTrigger >
                        <div className={cn(`w-[100px] h-[130px] bg-lusion-lightgray mx-1 rounded-lg p-2 m-2
                         shadow-md shadow-lusion-gray  select-none cursor-pointer overflow-clip
                         text-lusion-black hover:opacity-70 hover:scale-105 transition-transform delay-75`,
                            {
                                "text-sm w-[150px] h-[200px]": displaySize === "fullsize",
                                "text-xs": displaySize === "quartersize" || displaySize === "halfsize",
                            }
                        )}>
                            <div className="flex justify-between items-cener font-bold w-full overflow-hidden">
                                <div className={cn("", {
                                    "text-sm": displaySize === "quartersize" || displaySize === "halfsize",
                                    "text-base": displaySize === "fullsize"

                                })}>
                                    {workout.workoutName.slice(0, titleTrimAmount) }
                                    {workout.workoutName.length > titleTrimAmount && "..."}
                                </div>
                                <div className="font-normal text-xs">
                                    {getmmdd(workout.lastUpdated)}
                                </div>
                            </div>
                            <div className="overflow-auto h-[60%] my-1 pb-4">
                                {workout.exercises.map((exercise, index) => (
                                    <div key={index}>
                                        {exercise.exerciseName}:{exercise.reps}x{exercise.sets}
                                    </div>
                                ))}

                            </div>

                            <div className="mb-1">
                            &lt;&lt;placeholder&gt;&gt; 
                            </div>
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

export default WorkoutCard;