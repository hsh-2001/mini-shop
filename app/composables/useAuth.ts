import type { ILoginRequest } from "~/model/login";

export default function useAuth() {
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
                window.location.href = "/";
            } else {
                console.error("Login failed:", response.message);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
        finally {
            isLoading.value = false;
        }
    }

    return {
        loginModel,
        handleLogin,
        isAuth,
        isLoading,
    };
};