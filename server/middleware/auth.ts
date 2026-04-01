export default defineEventHandler(async (event) => {
    if (event.path.startsWith("/api/auth/")) return
    const token = getCookie(event, "session_token");
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }
});