export default function useNavbar() {
    const { locale, setLocale } = useI18n();

    const selectedLanguage = ref(locale.value);
    const onChangeLanguage = (val: 'en' | 'km') => {
        setLocale(val);
    }

    return {
        onChangeLanguage,
        selectedLanguage,
    }
}