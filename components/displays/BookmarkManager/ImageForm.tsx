
import clientPromise from "@/lib/mongodb"
import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { nanoid } from "nanoid"
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod"
import { uploadBookmarkToMongoDB, uploadImageToS3 } from "@/app/(dashboard)/actions/bookmarkActions";




async function onSubmit(formData: FormData) {
    'use server'
    try {
        //upload image to s3 and get the public file key
        const [s3ImageUploadResponse, s3FileKey] = await uploadImageToS3(formData)
        if (s3ImageUploadResponse && !s3ImageUploadResponse?.ok) {
            throw new Error("Error occurred with file upload")
        }
        const res = await uploadBookmarkToMongoDB(s3FileKey, formData)
        console.log(res)
    } catch (e: any) {
        console.error(e)
    }
}

const ImageForm = async () => {

    return (
        <div>
            <form action={onSubmit}>
                bookmarkname
                <input className="border-2 border-black" type="text" name="bookmarkName" />
                link
                <input className="border-2 border-black" type="text" name="bookmarkLink" />
                <input className="border-2 border-black" type="file" name="bookmarkImage" />
                <button type="submit" value="upload">Submit</button>
            </form>
            {/* <img src="https://untitled-bookmarks.s3.us-east-2.amazonaws.com/fUTACChohjNiwvJeqgDV_" /> */}
        </div>
    );
}

export default ImageForm;
