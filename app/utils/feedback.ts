type MessageType = "success" | "warning" | "error";

export const showFeedback = async (type: MessageType, message: string) => {
    if (import.meta.server) {
        if (type === "error") {
            console.error(message);
        }
        return;
    }

    const { ElMessage } = await import("element-plus");
    ElMessage[type](message);
};

export const confirmWarning = async (message: string, title: string) => {
    if (import.meta.server) {
        return false;
    }

    const { ElMessageBox } = await import("element-plus");

    try {
        await ElMessageBox.confirm(message, title, {
            type: "warning",
        });
        return true;
    } catch (error) {
        if (error === "cancel" || error === "close") {
            return false;
        }

        throw error;
    }
};
