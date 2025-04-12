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
import { Rect } from "@dnd-kit/core/dist/utilities"
import { Workout } from "@/actions/workoutManager/createWorkout/schema"
import toast from "react-hot-toast"

export function WorkoutCombobox({ formField }: { formField: any }) {
    //TODO: populate the formfields using the selected workouts
    const [selectedWorkout, setSelectedWorkout] = React.useState<Workout | undefined>();
    const [allWorkouts, setAllWorkouts] = React.useState<Array<Workout>>([])
    const [open, setOpen] = React.useState(false)

    console.log(allWorkouts)
    React.useEffect(() => {
        //get all distinct workouts form this year
        fetch("api/workoutTracker/getWorkoutsForCombobox")
            .then(res => {
                if (res.ok) {
                    return res.json()
                        .then(data => setAllWorkouts(data))
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
                        name={formField.name}
                        data-slot="input"
                        readOnly
                        className="disabled:opacity-100  focus:border-none border-none bg-transparent shadow-none"
                        placeholder="Select a workout"
                        value={formField.valu
                            ? allWorkouts.find((workout) => workout.workoutName === formField.value)?.workoutName
                            : ""}
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
                            {allWorkouts.map((workout) => (
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
