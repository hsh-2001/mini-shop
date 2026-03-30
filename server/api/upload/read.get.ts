import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { streamToBuffer } from "~~/server/utils/streamToBuffer"

export default defineEventHandler(async (event) => {
    const { filename } = getQuery(event)
    const config = useRuntimeConfig()

    if (!filename) {
        throw createError({
            statusCode: 400,
            statusMessage: "File name is required"
        })
    }

    const s3 = new S3Client({
        region: "auto",
        endpoint: `https://${config.cfAccountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: config.cfAccessKey,
            secretAccessKey: config.cfSecretKey,
        },
    })

    const command = new GetObjectCommand({
        Bucket: config.cfBucketName,
        Key: String(filename),
    })

    const { Body, ContentType } = await s3.send(command)

    const buffer = await streamToBuffer(Body);
    return send(event, buffer, ContentType || "application/octet-stream")
})