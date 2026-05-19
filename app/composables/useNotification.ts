export default function useNotification() {
    const notifications = ref({
        pendingOrder: 0,
        pendingPayment: 0,
    });

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const getNotification = async () => {
        try {
            const response = await callGetNotification();
            if (response.isSuccess) {
                notifications.value = response.data;
            }
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    const startPolling = () => {
        stopPolling();
        intervalId = setInterval(() => {
            getNotification();
        }, 30000);
    };

    const stopPolling = () => {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    onUnmounted(() => {
        stopPolling();
    });

    return {
        getNotification,
        notifications,
        startPolling,
        stopPolling,
    };
}
