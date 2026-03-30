import { menuItems } from "~/constants/menuItem";
import type { UserRole } from "~~/prisma/generated/enums";

export default function useNavbar() {
    const { locale, setLocale, t } = useI18n();
    const store = useAppStore();
    const { currentUser } = store;

    const getUserRole = (() => {
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
            try {
                const role = JSON.parse(userInfo).role as UserRole;
                return role;
            } catch (error) {
                console.error('Failed to parse user info:', error);
                return null;
            }
        }
        return null;
    })();
    const languageOptions = computed(() => [
        { value: "en", label: t("English") },
        { value: "km", label: t("Khmer") },
    ] as const);
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

    const filterMenuItems = computed(() => {
        const parentItems = menuItems.filter(item => item.allowRoles?.includes(getUserRole as UserRole));
        return parentItems.map(item => {
            if (item.children) {
                const filteredChildren = item.children.filter(child => child.allowRoles?.includes(getUserRole as UserRole));
                return { ...item, children: filteredChildren };
            }
            return item;
        })
    });
    return {
        selectedLanguage,
        languageOptions,
        logOut,
        filterMenuItems,
        currentUser,
    }
}
