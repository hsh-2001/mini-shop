import { ShopResponse, type IUpdateShopRequest } from "~/model/setting";

export default function useSetting() {
    const store = useAppStore();
    const { setCurrency } = store;
    const isEditting = ref(false);
    const shop = ref<ShopResponse>({} as ShopResponse);
    const model = ref<IUpdateShopRequest>({
        name: "",
        username: "",
        description: "",
        address: "",
        phone: "",
        currencyBase: "",
        exchangeUSD: 1,
        exchangeKHR: 1,
        openingHours: "",
    });

    const getShopSetting = async () => {
        try {
            const response = await callGetShopSetting();
            if (response.isSuccess) {
                shop.value = new ShopResponse(response.data);
                setCurrency({
                    currencyBase: shop.value.currencyBase,
                    exchangeUSD: shop.value.exchangeUSD,
                    exchangeKHR: shop.value.exchangeKHR,
                });
                model.value = {
                    name: shop.value.name,
                    description: shop.value.description,
                    address: shop.value.address,
                    phone: shop.value.phone,
                    currencyBase: shop.value.currencyBase,
                    exchangeUSD: shop.value.exchangeUSD,
                    exchangeKHR: shop.value.exchangeKHR,
                    openingHours: shop.value.openingHours,
                    username: shop.value.users?.[0]?.username ?? "",
                };
            } else {
                console.error("Failed to fetch shop setting:", response.message);
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch shop setting:", error);
        }
    }

    const updateShopSetting = async () => {
        try {
            const response = await callUpdateShopSetting(model.value);
            if (response.isSuccess) {
                isEditting.value = false;
                await getShopSetting();
                isEditting.value = false;
            } else {
                console.error("Failed to update shop setting:", response.message);
            }
        } catch (error) {
            console.error("Failed to update shop setting:", error);
        }
    }

    return {
        getShopSetting,
        shop,
        model,
        isEditting,
        updateShopSetting,
    }
};