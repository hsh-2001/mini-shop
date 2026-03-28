export default defineNuxtPlugin((nuxtApp) => {
    const store = useAppStore();
    nuxtApp.provide('appStore', store);
});
