
import clientPromise from "@/lib/mongodb"
import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { nanoid } from "nanoid"
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod"



async function uploadImageToS3(formData: FormData) {
    'use server'
    try {
        const client = new S3Client({
            region: process.env.AWS_REGION
        })
        const s3FileKey = nanoid();
        const { url, fields } = await createPresignedPost(client, {
            Bucket: process.env.AWS_BUCKET_NAME || '',
            Key: s3FileKey
        })

        //create formdata to send to s3
        const formDataForS3 = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
            formDataForS3.append(key, value)
        })
        formDataForS3.append('file', formData.get('bookmarkImage') as string)
        const s3ImageUploadResponse: any = await fetch(url, {
            method: 'POST',
            body: formDataForS3
        })

        const textResponse = await s3ImageUploadResponse.text()
        console.log(textResponse)
        return [s3ImageUploadResponse, s3FileKey]
    } catch (e) {
        console.error(e)
    }
    return [null, null]
}

async function uploadBookmarkToMongoDB(s3FileKey: string, formData: FormData) {
    try {
        // see if user is signed in. if not, they are treated as a guest
        const user = await currentUser()
        let userId;
        if (!user) {
            userId = 'guest'
        } else {
            userId = user.id
        }
        // is response is ok, upload bookmark to mongodb
        const publicImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3FileKey}`;

        // connect to mongodbclient
        const mongoDbClient = await clientPromise;
        if (!mongoDbClient) {
            throw new Error("Error with setting up mongodb client")
        }

        const db = mongoDbClient.db("untitled");
        const bookmark: Bookmark = {
            bookmarkName: formData.get("bookmarkName") as string,
            userId: userId,
            imagePath: publicImageUrl,
            url: formData.get("bookmarkLink") as string
        }
        const res = await db.collection("bookmarks").insertOne(bookmark)
        return res
    } catch (e) {
        console.error(e)
    }
}
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
