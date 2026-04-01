export default defineEventHandler(async (event) => {
    return;
    const authHeader = getRequestHeader(event, "authorization")
    if (!authHeader) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        })
    }

    try {
        // Here you would verify the token and extract user info
        // For example:
        // const user = verifyToken(token)
        // event.context.user = user
    } catch (error) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        })
    }
});