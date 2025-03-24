'use client'

import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form, } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WorkoutCombobox } from "./WorkoutCombobox"
const AddWorkoutForm = () => {

    const formSchema = z.object({
        workoutName: z.string().min(2).max(50),
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workoutName: "",
        },
    })
    console.log(form)

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="workoutName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Workout</FormLabel>
                            <FormControl>
                                <WorkoutCombobox formField={field} />
                                {/* <Input {...field} /> */}
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
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

export default AddWorkoutForm;