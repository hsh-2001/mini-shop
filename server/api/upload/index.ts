import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { readMultipartFormData } from "h3"

export default defineEventHandler(async (event) => {
    try {
        if (isMethod(event, "POST")) {
            const form = await readMultipartFormData(event)
            const file = form?.find(f => f.name === "file")
            if (!file) {
                throw createError({ statusCode: 400, statusMessage: "No file uploaded" })
            }

            const config = useRuntimeConfig();

            const s3 = new S3Client({
                region: "auto",
                endpoint: `https://${config.cfAccountId}.r2.cloudflarestorage.com`,
                credentials: {
                    accessKeyId: String(config.cfAccessKey),
                    secretAccessKey: String(config.cfSecretKey),
                },
            })
            const fileName = `${Date.now()}-${file.filename}`

            await s3.send(new PutObjectCommand({
                Bucket: config.cfBucketName,
                Key: fileName,
                Body: file.data,
                ContentType: file.type,
            }))

            return {
                url: `https://${config.cfPublicUrl}/${fileName}`
            }
        }

        if (isMethod(event, "GET")) {
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

            const result = await s3.send(new GetObjectCommand({
                Bucket: config.cfBucketName,
                Key: String(filename),
            }))

            setHeader(event, "Content-Type", result.ContentType || "application/octet-stream")
            setHeader(event, "Content-Disposition", `inline; filename="${filename}"`)

            return result.Body
        }
    } catch (error) {
        console.error("Error uploading files:", error)
    }
})