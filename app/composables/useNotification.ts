export default function useNotification() {

    const notifications = ref({
        peddingOrder: 0,
        peddingPayment: 0,
    });
    const getNotification = async () => {
        try {
            const response = await callGetNotification();
            if (response.isSuccess) {
                notifications.value = response.data;
            }
        } catch (error) {
            console.error('Fail calling api');
        }
    }

    setInterval(() => {
        getNotification();
    }, 3000);

    return {
        getNotification,
        notifications,
    }
}