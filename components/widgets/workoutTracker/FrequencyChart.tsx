import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { displaySize } from "@/components/widgetDisplay/types";
import { cn } from "@/lib/utils";
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts";

export type FrequencyChartData = Array<{ day: string, workouts: number }>

interface FrequencyChartProps {
    displaySize: displaySize;
    frequencyChartData: FrequencyChartData;
}
const chartConfig = {
    workouts: {
        label: "Workouts",
        color: "#2563eb",
    },
} satisfies ChartConfig

/**
 * Frequency chart that opens up a weekly report when clicked.
 */
const FrequencyChart = ({ displaySize, frequencyChartData }: FrequencyChartProps) => {
    return (


        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <ChartContainer config={chartConfig}
                        className={cn("flex-1 w-auto cursor-crosshair ", {
                            "max-h-20 w-60": displaySize === "quartersize",
                            "max-h-24 w-60": displaySize === "halfsize",
                            "max-h-24 xl:max-h-36 w-96 ": displaySize === "fullsize",
                        })}>
                        <BarChart accessibilityLayer data={frequencyChartData} className="hover:bg-lusion-lightgray/10 transition-colors delay-150 hover:!cursor-pointer">
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 5)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar color="red" dataKey="workouts" fill="var(--color-lusion-blue)" radius={2} />
                        </BarChart>
                    </ChartContainer>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Click to view weekly report</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default FrequencyChart;