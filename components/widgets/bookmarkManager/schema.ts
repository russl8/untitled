import { z } from "zod";

export const imageFormSchema = z.object({
    bookmarkName: z.string().min(2).max(50),
    bookmarkImage: z.instanceof(Blob).refine(file => [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
        "image/gif",
    ].includes(file.type),
        { message: "Invalid image file type" }
    ),
    bookmarkLink: z.string().url()
})