import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { readMultipartFormData } from "h3"

export default defineEventHandler(async (event) => {
    const form = await readMultipartFormData(event)
    const files = form?.filter(f => f.name === "files") || []
    if (files.length === 0) {
        throw createError({ statusCode: 400, statusMessage: "No files uploaded" })
    }

    const config = useRuntimeConfig();

    const s3 = new S3Client({
        region: "auto",
        endpoint: `https://${config.cfAccountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: String(config.cfAccessKey),
            secretAccessKey: String(config.cfSecretKey),
        },
    });

    const results = await Promise.all(
        files.map(async (f) => {
            const name = `${Date.now()}-${f.filename}`

            await s3.send(new PutObjectCommand({
                Bucket: config.cfBucketName,
                Key: name,
                Body: f.data,
                ContentType: f.type,
            }))

            return {
                name: f.filename,
                url: `https://${config.cfPublicUrl}/${name}`,
            }
        })
    )

    return {
        files: results
    }
})