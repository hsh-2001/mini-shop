export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.server) return;

    const publicPaths = ["/login", "/shop", "/shop/success"];
    const isPublicPath = publicPaths.includes(to.path) || to.path.startsWith("/shop/");

    const isAuthorized = (() => {
        const token = useCookie('session_token').value;
        return !!token;
    })();

    if (!isAuthorized && !isPublicPath) {
        return window.location.href = '/login';
    } else if (isAuthorized && to.path === '/login') {
        return window.location.href = '/';
    }
});
