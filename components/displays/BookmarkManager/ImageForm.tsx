"use client"
import { createBookmark, uploadBookmarkToMongoDB, uploadImageToS3 } from "@/actions/dashboard/bookmarkActions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { imageFormSchema } from "./schema"
const ImageForm = () => {
    const form = useForm<z.infer<typeof imageFormSchema>>({
        resolver: zodResolver(imageFormSchema),
        defaultValues: {
            bookmarkName: "",
            bookmarkImage: undefined,
            bookmarkLink: "https://"
        },
    })
    async function onSubmit(values: z.infer<typeof imageFormSchema>) {
        const formData = new FormData()
        formData.append("bookmarkImage", values.bookmarkImage)
        formData.append("bookmarkName", values.bookmarkName)
        formData.append("bookmarkLink", values.bookmarkLink)
        await createBookmark(formData)
        console.log(values)
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="bookmarkName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bookmark Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bookmarkLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bookmark Link</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Bookmark Link
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bookmarkImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bookmark Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/gif"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            field.onChange(file);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>Upload an image for your bookmark.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default ImageForm;
