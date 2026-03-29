import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { readMultipartFormData } from "h3"
import { success } from "~~/types/baseApi"

export default defineEventHandler(async (event) => {
    try {
        if (isMethod(event, "POST")) {
            const form = await readMultipartFormData(event)
            const file = form?.find(f => f.name === "file")
            const path = form?.find(f => f.name === "path")?.data.toString() || ""
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
            const fileName = path ? `${path}/${Date.now()}-${file.filename}` : `${Date.now()}-${file.filename}`

            await s3.send(new PutObjectCommand({
                Bucket: config.cfBucketName,
                Key: fileName,
                Body: file.data,
                ContentType: file.type,
            }))

            const data = {
                filename: fileName,
                url: `https://${config.cfAccountId}.r2.cloudflarestorage.com/${config.cfBucketName}/${fileName}`,
            }

            return success(data);
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

            const url = await getSignedUrl(
                s3,
                new GetObjectCommand({
                    Bucket: config.cfBucketName,
                    Key: String(filename),
                }),
            )

            return success({ url });
        }
    } catch (error) {
        console.error("Error uploading files:", error)
    }
})