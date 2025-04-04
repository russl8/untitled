import { Button } from "@/components/ui/button";
import DisplayLoading from "@/components/widgetDisplay/DisplayLoading";
import { displaySize } from "@/components/widgetDisplay/types";
import { LucideBook, PencilLineIcon, Plus, PlusCircle, ReceiptText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddWorkoutForm from "./AddWorkoutForm";
import { Workout } from "@/actions/workoutManager/createWorkout/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scrollarea"
import WorkoutCard from "./WorkoutCard";
import { cn } from "@/lib/utils";
import WorkoutReport from "./WorkoutReport";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart } from "recharts";
import { CartesianGrid, XAxis } from "recharts"

import {

    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile";
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

    const isMobile = useIsMobile()
    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]


    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    if (loading) return <DisplayLoading />;
    
    return (
        <div className="flex flex-col justify-around items-center h-full">
            <div className="h-full w-full flex flex-col align-top">
                <div className="flex justify-between border-b-1 border-lusion-lightgray">
                    <Dialog >
                        <DialogTrigger id="addWorkoutModalTrigger" className="mb-2">
                            <div className="flex flex-row items-center h-10 py-2 px-4 cursor-pointer border border-input bg-background shadow-xs hover:bg-accent rounded-md hover:text-accent-foreground">
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
                        <DialogTrigger id="addWorkoutModalTrigger" className="mb-2 flex w-full">

                            <ChartContainer config={chartConfig} className={cn("flex-1 w-auto", {
                                "max-h-20 ": displaySize === "quartersize",
                                "max-h-24":displaySize === "halfsize",
                                "max-h-24 xl:max-h-36 ":displaySize === "fullsize",
                                })}>
                                <BarChart accessibilityLayer data={chartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Report</DialogTitle>
                            </DialogHeader>
                            <WorkoutReport />
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