import { Workout } from "@/actions/createWorkout/schema";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getmmdd } from "@/lib/utils";

interface WorkoutwidgetItemProps {
    workout: Workout
}
const WorkoutWidgetItem = ({ workout }: WorkoutwidgetItemProps) => {
    return (
        <TooltipProvider    >
            <Tooltip>
                <TooltipTrigger >
                    <div className=" py-1 px-4 my-1 rounded-lg  cursor-pointer text-gray-600 hover:bg-white hover:opacity-50">
                        <p>{getmmdd(workout.lastUpdated)} {workout.workoutName}</p>
                    </div>
                </TooltipTrigger>
                <TooltipContent sideOffset={-10} className="m-0 p-0">
                    <div className="flex flex-col p-0 m-0">
                        <Button className="h-6 hover:text-gray-400 cursor-pointer p-4 m-0">View details</Button>
                        <Button className="h-6 hover:text-gray-400 cursor-pointer  p-4 m-0">Delete</Button>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default WorkoutWidgetItem;