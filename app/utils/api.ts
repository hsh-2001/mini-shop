import axios from "axios";
import { hasClientSessionToken, isPublicPath, isUnauthenticatedError, logoutClient } from "~/utils/authSession";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    if (!import.meta.client) {
        return config;
    }

    const currentPath = window.location.pathname;
    if (!isPublicPath(currentPath) && !hasClientSessionToken()) {
        await logoutClient();
        return Promise.reject(new axios.Cancel("Missing session token"));
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (import.meta.client && isUnauthenticatedError(error)) {
            await logoutClient();
        }

        return Promise.reject(error);
    },
);

export default api;
