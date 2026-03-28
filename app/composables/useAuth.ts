import type { ILoginRequest } from "~/model/login";

export default function useAuth() {
    const isAuth = ref(false);
    const loginModel = ref<ILoginRequest>({
        identifier: "",
        password: "",
    });

    const handleLogin = async () => {
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
    }

    return {
        loginModel,
        handleLogin,
        isAuth,
    };
};