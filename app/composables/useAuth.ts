import type { ILoginRequest } from "~/model/login";
import { UserRole } from "~~/prisma/generated/enums";

export default function useAuth() {
    const store = useAppStore();
    const { setCurrency } = store;
    const isAuth = ref(false);
    const isLoading = ref(false);
    const loginModel = ref<ILoginRequest>({
        identifier: "",
        password: "",
    });

    const handleLogin = async () => {
        isLoading.value = true;
        try {
            const response = await callLogin(loginModel.value);
            if (response.isSuccess) {
                isAuth.value = true;
                if (response.data.role === UserRole.CASHIER) {
                    window.location.href = "/cashier";
                } else {
                    window.location.href = "/";
                }
                localStorage.setItem("user", JSON.stringify(response.data));
            } else {
                notificationHelper.error(response.message)
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
        isLoading.value = false;
    }

    return {
        loginModel,
        handleLogin,
        isAuth,
        isLoading,
    };
};