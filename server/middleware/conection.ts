export default defineEventHandler(async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return;
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: "Server connection failed",
        });
    }
});