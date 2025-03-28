'use client';

import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkoutCombobox } from "./WorkoutCombobox";
import { useState } from "react";
import { workoutFormSchema } from "@/actions/createWorkout/schema";
import createWorkout from "@/actions/createWorkout";
import toast from "react-hot-toast";



const AddWorkoutForm = ({ fetchWorkouts }: { fetchWorkouts: () => void }) => {
    const form = useForm<z.infer<typeof workoutFormSchema>>({
        resolver: zodResolver(workoutFormSchema),
        defaultValues: {
            workoutName: "",
            exercises: [{ exerciseName: "", sets: 1, reps: 1, extraInfo: "" }]
        }
    });
    const [isNewWorkout, setIsNewWorkout] = useState<boolean>(false)
    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({  
        control,
        name: "exercises"
    });

    function onSubmit(values: z.infer<typeof workoutFormSchema>) {
        createWorkout(values)
            .then(_ => {
                toast.success("Workout added!")
                fetchWorkouts();
            })
            .catch(err => {
                toast.error("Error... workout could not be added :( " + err)
            })
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Workout selector */}
                {isNewWorkout
                    ?
                    <FormField
                        control={form.control}
                        name="workoutName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Workout</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter a workout name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    <span className="underline cursor-pointer hover:text-gray-700" onClick={() => setIsNewWorkout(false)}>
                                        Select from an existing workout
                                    </span>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    :
                    <FormField
                        control={form.control}
                        name="workoutName"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Workout</FormLabel>
                                <FormControl>
                                    <WorkoutCombobox formField={field} />
                                </FormControl>
                                <FormDescription>
                                    <span>
                                        Select from an existing workout, or add a new one{' '}
                                        <span className="underline cursor-pointer hover:text-gray-700" onClick={() => setIsNewWorkout(true)}>
                                            here
                                        </span>
                                    </span>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />}

                <div className="grid grid-cols-8 gap-2 max-h-[200px] overflow-auto scroll-m-1">
                    <div className="col-span-2">Exercise</div>
                    <div className="col-span-1">Sets</div>
                    <div className="col-span-1">Reps</div>
                    <div className="col-span-4">Notes</div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="contents">
                            <FormField
                                control={control}
                                name={`exercises.${index}.exerciseName`}
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`exercises.${index}.sets`}
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormControl>
                                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`exercises.${index}.reps`}
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormControl>
                                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`exercises.${index}.extraInfo`}
                                render={({ field }) => (
                                    <FormItem className="col-span-3">
                                        <FormControl>
                                            <Input {...field} placeholder="Extra Info" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" onClick={() => remove(index)} variant="outline">
                                <Trash2 />
                            </Button>
                        </div>
                    ))}

                    <Button type="button" onClick={() => append({ exerciseName: "", sets: 1, reps: 1, extraInfo: "" })} variant="outline">
                        <Plus />
                    </Button>
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};

export default AddWorkoutForm;
