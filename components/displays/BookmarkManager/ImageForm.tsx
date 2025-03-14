
import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { nanoid } from "nanoid"
async function onSubmit(formData: FormData) {
    'use server'
    // TODO: INTERGRATE WITH MONGODB
    try {
        const client = new S3Client({
            region: process.env.AWS_REGION
        })
        const { url, fields } = await createPresignedPost(client, {
            Bucket: process.env.AWS_BUCKET_NAME || '',
            Key: nanoid()
        })

        //create formdata to send to s3
        const formDataS3 = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
            formDataS3.append(key, value)
        })
        formDataS3.append('file', formData.get('userSubmittedFile') as string)

        const response = await fetch(url, {
            method: 'POST',
            body: formDataS3
        })

        const textResponse = await response.text();
        console.log(textResponse)
        if (response.ok) {
            console.log("File uploaded")
        } else {
            console.log("Error occurred with file upload")
        }
    } catch (e: any) {
        console.error(e)
    }
}

const ImageForm = async () => {

    return (
        <div>
            <form action={onSubmit}>
                <input type="file" name="userSubmittedFile" />
                <button type="submit" value="upload">Submit</button>
            </form>
        </div>
    );
}

export default ImageForm;
