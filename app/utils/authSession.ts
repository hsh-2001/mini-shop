import { navigateTo, useCookie } from "#app";
import { useAppStore } from "~/stores";

const LOGIN_PATH = "/login";
const PUBLIC_PATHS = ["/login", "/shop", "/shop/success"];

let isLoggingOut = false;

const isClient = () => import.meta.client;

export const isPublicPath = (path: string) => {
    return PUBLIC_PATHS.includes(path) || path.startsWith("/shop/");
};

export const clearClientSession = () => {
    if (!isClient()) {
        return;
    }

    const store = useAppStore();
    localStorage.removeItem("user");
    useCookie("session_token").value = null;
    store.$reset();
};

export const logoutClient = async () => {
    if (!isClient() || isLoggingOut) {
        return;
    }

    isLoggingOut = true;
    clearClientSession();

    const currentPath = window.location.pathname;
    if (!isPublicPath(currentPath)) {
        await navigateTo(LOGIN_PATH, { replace: true });
    }

    isLoggingOut = false;
};

export const hasClientSessionToken = () => {
    if (!isClient()) {
        return false;
    }

    return Boolean(useCookie("session_token").value);
};

export const isUnauthenticatedError = (error: unknown) => {
    const status = (error as any)?.response?.status;
    const responseMessage = (error as any)?.response?.data?.message;
    const fallbackMessage = (error as any)?.message;
    const message = String(responseMessage || fallbackMessage || "").toLowerCase();

    return status === 401
        || status === 403
        || message.includes("authentication required")
        || message.includes("unauthorized")
        || message.includes("unauthenticated");
};
