"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Workout } from "@/actions/workoutManager/createWorkout/schema"
import toast from "react-hot-toast"
import { ControllerRenderProps, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form"

interface WorkoutComboboxProps {
    formField: ControllerRenderProps<{
        workoutName: string;
        exercises: {
            exerciseName: string;
            sets: number;
            reps: number;
            weight: number;
            extraInfo: string;
        }[];
        lastUpdated: Date;
    }, "workoutName">;
    appendToFormField: UseFieldArrayAppend<any>;
    removeFormField: UseFieldArrayRemove;

}

export function WorkoutCombobox({ formField, appendToFormField, removeFormField }: WorkoutComboboxProps) {
    //TODO: populate the formfields using the selected workouts
    const [allWorkouts, setAllWorkouts] = React.useState<Record<string, Workout>>({})
    // const [allWorkouts, setAllWorkouts] = React.useState<Array<Workout>>([])

    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const selectedWorkout = formField.value
        if (Object.keys(allWorkouts).includes(selectedWorkout)) {
            for (const exercise of allWorkouts[selectedWorkout].exercises) {
                appendToFormField(exercise)
            }
        }
    }, [formField.value])

    React.useEffect(() => {
        //get all distinct workouts form this year
        fetch("api/workoutTracker/getWorkoutsForCombobox")
            .then(res => {
                if (res.ok) {
                    return res.json()
                        .then(data => {
                            removeFormField()
                            const map: Record<any, any> = {}
                            for (const workout of data) {
                                map[workout.workoutName] = workout
                            }
                            setAllWorkouts(map)
                        })
                } else {
                    toast.error("An error occurred. Please try again!")
                }
            })
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    <Input
                        data-slot="input"
                        readOnly
                        className="disabled:opacity-100  focus:border-none border-none bg-transparent shadow-none"
                        placeholder="Select a workout"
                        {...formField}
                    />

                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {Object.values(allWorkouts).map((workout) => (
                                <CommandItem
                                    key={workout.workoutName}
                                    value={workout.workoutName}
                                    onSelect={(currentValue) => {
                                        formField.onChange(currentValue === formField.value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {workout.workoutName}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            formField.value === workout.workoutName ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>

        </Popover>
    )
}
