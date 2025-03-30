import {DialogTitle } from "@/components/ui/dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Workout, updateFormSchema } from "@/actions/workoutManager/createWorkout/schema";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { getmmdd } from "@/lib/utils";
import { cn } from "@/lib/utils";
import updateWorkout from "@/actions/workoutManager/updateWorkout";
const WorkoutDetails = ({ workout, fetchWorkouts }: { workout: Workout, fetchWorkouts: () => void }) => {

    const form = useForm<z.infer<typeof updateFormSchema>>({
        resolver: zodResolver(updateFormSchema),
        defaultValues: {
            exercises: workout.exercises
        }
    });
    const [isEditing, setIsEditing] = useState(false)
    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "exercises"
    });

    function onSubmit(values: z.infer<typeof updateFormSchema>) {
        updateWorkout(values,workout._id)
            .then(_ => {
                toast.success("Workout updated!")
                fetchWorkouts();
            })
            .catch(err => {
                toast.error("Error... workout could not be updated :( " + err)
            })
    }
    return (
        <div>
            <div className="flex items-center">
                <DialogTitle>
                    <p>{getmmdd(workout.lastUpdated)}: {workout.workoutName}</p>
                </DialogTitle>
                <Button
                    className={cn("ml-2 h-8 w-8", {
                        " animate-pulse": isEditing
                    })}
                    onClick={() => setIsEditing(!isEditing)}>
                    <Edit />
                </Button>
            </div>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 enableScrollbar">

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
                                                <Input {...field} disabled={!isEditing} />
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
                                                <Input disabled={!isEditing} type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
                                                <Input disabled={!isEditing} type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`exercises.${index}.extraInfo`}
                                    render={({ field }) => (
                                        <FormItem className={cn("col-span-4", {
                                            "col-span-3": isEditing
                                        })}>
                                            <FormControl>
                                                <Input disabled={!isEditing} {...field} placeholder="Extra Info" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {isEditing &&
                                    <Button type="button" onClick={() => remove(index)} variant="outline">
                                        <Trash2 />
                                    </Button>
                                }
                            </div>
                        ))}

                        {isEditing &&
                            <Button type="button" onClick={() => append({ exerciseName: "", sets: 1, reps: 1, extraInfo: "" })} variant="outline">
                                <Plus />
                            </Button>
                        }
                    </div>

                    {isEditing && <Button type="submit">Make Changes</Button>}
                </form>
            </Form>
        </div>
    );
}

export default WorkoutDetails;