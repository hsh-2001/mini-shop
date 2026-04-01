const rateMap = new Map<string, { count: number; time: number }>()

const LIMIT = 10      // max requests
const WINDOW = 60 * 2000 // 1 minute

export default defineEventHandler((event) => {
    const apiForCheck = [
        "/api/auth/login",
        "/api/auth/register",
        "/api/products",
    ]
    if (!apiForCheck.includes(event.path)) return
    if (isMethod(event, "GET")) return

    const ip = getRequestHeader(event, "x-forwarded-for") ||
        event.node.req.socket.remoteAddress ||
        "unknown"

    const now = Date.now()
    const record = rateMap.get(ip) || { count: 0, time: now }

    if (now - record.time > WINDOW) {
        record.count = 0
        record.time = now
    }

    record.count++
    rateMap.set(ip, record)

    if (record.count > LIMIT) {
        throw createError({
            statusCode: 429,
            statusMessage: "Too Many Requests",
        })
    }
})