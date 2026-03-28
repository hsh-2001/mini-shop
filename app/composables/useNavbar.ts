export default function useNavbar() {
    const { locale, setLocale } = useI18n();

    const selectedLanguage = computed({
        get: () => locale.value as 'en' | 'km',
        set: (val: 'en' | 'km') => {
            setLocale(val);
        },
    });

    return {
        selectedLanguage,
    }
}
