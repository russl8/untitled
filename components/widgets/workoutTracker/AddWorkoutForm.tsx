'use client'

import { z } from "zod"

import { Plus, Trash2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form, } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WorkoutCombobox } from "./WorkoutCombobox"
import { useState } from "react"
type Exercise = {
    exeriseName: string,
    sets: number,
    reps: number,
    extraInfo: string,
}
const AddWorkoutForm = () => {
    const [exercises, setExercises] = useState<Array<Exercise>>([
        {
            exeriseName: "",
            sets: 0,
            reps: 0,
            extraInfo: "",
        }
    ]);
    const formSchema = z.object({
        workoutName: z.string().min(2).max(50),
        exercises: z.any()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workoutName: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    const ExerciseField = ({ index }: { index: number }) => {
        return (
            <div className="contents ">
                <Input className="col-span-2" />
                <Input className="col-span-1" />
                <Input className="col-span-1" />
                <Input className="col-span-3" />
                <Button
                    onClick={() => {
                        console.log(exercises)
                        handleDeleteExercise(index)
                        console.log(exercises)
                    }}
                    className="cursor-pointer"
                    type="button"
                    variant='outline'>
                    <Trash2 />
                </Button>
            </div>
        )

    }
    const handleDeleteExercise = (key: number) => {
        setExercises(exercises.filter((_, index) => index !== key))
    }
    const handleAddExercise = () => {
        const newExercise = {
            exeriseName: "",
            sets: 0,
            reps: 0,
            extraInfo: "",
        }
        setExercises([...exercises, newExercise])

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Workout selector */}
                <FormField
                    control={form.control}
                    name="workoutName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Workout</FormLabel>
                            <FormControl>
                                <WorkoutCombobox formField={field} />
                            </FormControl>
                            <FormDescription>
                                <span>
                                    Select from an existing workout, or add a new one{' '}
                                    <span className="underline cursor-pointer hover:text-gray-700">
                                        here
                                    </span>
                                </span>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-8 gap-2">
                    <div className="col-span-2">
                        Exercise
                    </div>
                    <div className="col-span-1">
                        Sets
                    </div>

                    <div className="col-span-1">
                        Reps
                    </div>

                    <div className="col-span-4">
                        Notes
                    </div>
                    {exercises.map((exercise, index) => (
                        <ExerciseField key={index} index={index} />
                    ))}
                    <Button
                        className="cursor-pointer"
                        type="button"
                        variant='outline'
                        onClick={handleAddExercise}
                    >
                        <Plus />
                    </Button>
                </div>


                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

export default AddWorkoutForm;