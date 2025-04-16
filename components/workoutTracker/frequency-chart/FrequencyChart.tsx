import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { displaySize } from "@/components/widgetDisplay/types";
import { cn } from "@/lib/utils";
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts";

export type FrequencyChartData = Array<{ day: string, workouts: number }>

interface FrequencyChartProps {
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
const FrequencyChart = ({ frequencyChartData }: FrequencyChartProps) => {
    return (


        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <ChartContainer config={chartConfig}
                        className={cn("flex-1 h-28 md:h-32 lg:h-44 w-full px-[20%] md:px-[30%]", )}>
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