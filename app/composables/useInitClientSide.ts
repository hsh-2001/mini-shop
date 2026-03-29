export default function useInitClientSide() {
    const store = useAppStore();
    const { setProducts, setCategories } = store;

    (() => {
        try {
            const data = localStorage.getItem('user');
            if (data) {
                const dataJson = JSON.parse(data);
                store.setUser(dataJson);
            }
        } catch (error) {
            console.error("Failed to parse user info:", error);
        }
        return null;
    })();

    const getAllProducts = async () => {
        try {
            const response = await callGetAllProducts();
            if (response.isSuccess) {
                setProducts(response.data);
            } else {
                console.error("Failed to fetch products:", response.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const getAllCategories = async () => {
        try {
            const response = await fetchCategories();
            if (response.isSuccess) {
                setCategories(response.data);
            } else {
                console.error("Failed to fetch categories:", response.message);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }


    return {
        getAllProducts,
        getAllCategories,
    }
};
