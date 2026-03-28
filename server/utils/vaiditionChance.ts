const getValidation = async <T>(props: T, validators: { [K in keyof T]?: (value: T[K]) => string | null }) => {
    for (const key in validators) {
        const validator = validators[key];
        if (validator) {
            const errorMessage = validator(props[key]);
            if (errorMessage) {
                return errorMessage;
            }
        }
    }

    return "";
};

export const validateLogin = async (props: { identifier?: string; password?: string }) => {
    return getValidation(props, {
        identifier: (value) => {
            if (!value?.trim()) {
                return "Identifier is required.";
            }
            if (/\s/.test(value)) {
                return "Identifier cannot contain spaces.";
            }
            if (value.trim().length < 4) {
                return "Identifier must be at least 4 characters.";
            }
            return null;
        },
        password: (value) => {
            if (!value?.trim()) {
                return "Password is required.";
            }
            if (value.trim().length < 6) {
                return "Password must be at least 6 characters.";
            }
            if (["password", "123456", "12345678"].includes(value.trim().toLowerCase())) {
                return "Password is too common.";
            }
            if (/\s/.test(value)) {
                return "Password cannot contain spaces.";
            }
            return null;
        },
    });
};