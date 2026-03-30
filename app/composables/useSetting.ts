export default function useSetting() {

    const getShopSetting = async () => {
        try {
            const response = await callGetShopSetting();
            if (response.isSuccess) {
                return response.data;
            } else {
                console.error("Failed to fetch shop setting:", response.message);
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch shop setting:", error);
        }
    }

    return {
        getShopSetting,
    }
};