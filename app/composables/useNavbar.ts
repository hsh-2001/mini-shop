export default function useNavbar() {
    const { locale, setLocale } = useI18n();

    const languageOptions = [
        { value: "en", label: "English" },
        { value: "km", label: "ខ្មែរ" },
    ] as const;
    const selectedLanguage = computed({
        get: () => locale.value as 'en' | 'km',
        set: (val: 'en' | 'km') => {
            setLocale(val);
        },
    });

    const logOut = async () => {
        localStorage.clear();
        useCookie('session_token').value = null;
        await navigateTo('/login');
    }

    return {
        selectedLanguage,
        languageOptions,
        logOut,
    }
}
