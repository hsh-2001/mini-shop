export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.server) return;

    const isAuthorized = (() => {
        const token = useCookie('session_token').value;
        return !!token;
    })();

    if (!isAuthorized && to.path !== '/login') {
        return window.location.href = '/login';
    } else if (isAuthorized && to.path === '/login') {
        return window.location.href = '/';
    }
});
