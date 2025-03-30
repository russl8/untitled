"use client"
import { createBookmark, uploadBookmarkToMongoDB, uploadImageToS3 } from "@/actions/bookmarkManager/createBookmark"
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
import { imageFormSchema } from "./schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { FetchBookmarksContext } from "./BookmarkManager";

interface BookmarkFormProps {
}

const AddBookmarkModal = ({ }: BookmarkFormProps) => {
    return (
        <Dialog>
            <DialogTrigger id="addBookmarkModalTrigger" >
                <div className=" text-sm rounded-lg cursor-pointer bg-primary text-primary-foreground shadow-xs hover:bg-primary/90" >
                    <Plus />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new bookmark</DialogTitle>
                </DialogHeader>
                <BookmarkForm />
            </DialogContent>
        </Dialog>
    )
}


const BookmarkForm = ({ }: BookmarkFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof imageFormSchema>>({
        resolver: zodResolver(imageFormSchema),
        defaultValues: {
            bookmarkName: "",
            bookmarkImage: undefined,
            bookmarkLink: "https://"
        },
    })
    const fetchBookmarks: () => void = useContext(FetchBookmarksContext)

    async function onSubmit(values: z.infer<typeof imageFormSchema>) {
        /**
         * Create a formdata object and pass it to the server action.
         * 
         * The server action uses the form data to add the image to s3, then 
         * uploads the rest of the bookmark along with the link to mongodb.
         */
        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("bookmarkImage", values.bookmarkImage)
        formData.append("bookmarkName", values.bookmarkName)
        formData.append("bookmarkLink", values.bookmarkLink)
        // TODO: loading state
        const response = await createBookmark(formData);
        if (response.status === "success") {
            toast.success('Boomark uploaded');
            form.reset()
            fetchBookmarks()

        } else {
            toast.error("Error with adding bookmark: " + response.message)
        }
        setIsSubmitting(false)
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={!isSubmitting ? form.handleSubmit(onSubmit) : () => { }} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="bookmarkName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bookmark Name</FormLabel>
                                <FormControl>
                                    <Input id="addBookmarkNameInput" {...field} />
                                </FormControl>
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
                                    <Input id="addBookmarkLinkInput" placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Must start with "http://" or "https://"
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
                                        placeholder="addBookmarkImage"
                                        id="addBookmarkFileInput"
                                        className="cursor-pointer"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/gif"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            field.onChange(file);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>Accepted types: .png, .jpeg, .jpg, .svg, .gif</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className={cn({ "cursor-not-allowed": isSubmitting })} type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default AddBookmarkModal;
