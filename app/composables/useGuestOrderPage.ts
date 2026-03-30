import { OrderType, PaymentMethod } from "~~/prisma/generated/enums";
import type { CatalogProductItem, CatalogResponse, GuestOrderPayload } from "~/model/order";
import { createGuestOrder, fetchPublicCatalog } from "~/utils/apiCalling";
import { showFeedback } from "~/utils/feedback";

interface CartLine {
    product: CatalogProductItem;
    quantity: number;
}

const createDefaultCheckoutForm = () => ({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    notes: "",
    type: OrderType.TAKEAWAY,
    paymentMethod: PaymentMethod.CASH,
});

const showError = (message: string) => {
    return showFeedback("error", message);
};

const showSuccess = (message: string) => {
    return showFeedback("success", message);
};

export const useGuestOrderPage = () => {
    const store = useAppStore();
    const catalog = ref<CatalogResponse>({
        shop: null,
        categories: [],
        products: [],
    });
    const isLoading = ref(true);
    const isSubmitting = ref(false);
    const selectedCategoryId = ref<number | "all">("all");
    const search = ref("");
    const cart = ref<CartLine[]>([]);
    const checkoutForm = ref(createDefaultCheckoutForm());

    const filteredProducts = computed(() => {
        const keyword = search.value.trim().toLowerCase();

        return catalog.value.products.filter((product) => {
            const matchesCategory = selectedCategoryId.value === "all"
                || product.categoryId === selectedCategoryId.value;
            const matchesKeyword = !keyword
                || product.name.toLowerCase().includes(keyword)
                || product.description?.toLowerCase().includes(keyword);

            return matchesCategory && matchesKeyword;
        });
    });

    const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));
    const subtotal = computed(() => cart.value.reduce(
        (sum, item) => sum + Number(item.product.basePrice) * item.quantity,
        0,
    ));

    const loadCatalog = async () => {
        isLoading.value = true;
        try {
            const response = await fetchPublicCatalog();
            if (!response.isSuccess) {
                throw new Error(response.message);
            }
            catalog.value = response.data;
            if (response.data.shop) {
                store.setCurrency({
                    currencyBase: response.data.shop.currencyBase,
                    exchangeUSD: Number(response.data.shop.exchangeUSD),
                    exchangeKHR: Number(response.data.shop.exchangeKHR),
                });
            }
        } catch (error) {
            await showError(error instanceof Error ? error.message : "Unable to load shop catalog.");
        } finally {
            isLoading.value = false;
        }
    };

    const addToCart = (product: CatalogProductItem) => {
        const existing = cart.value.find((item) => item.product.id === product.id);
        const currentQuantity = existing?.quantity ?? 0;

        if (product.stock >= 0 && currentQuantity >= product.stock) {
            void showError("This product has reached its stock limit.");
            return;
        }

        if (existing) {
            existing.quantity += 1;
            return;
        }

        cart.value.push({
            product,
            quantity: 1,
        });
    };

    const updateCartQuantity = (productId: number, quantity: number) => {
        const line = cart.value.find((item) => item.product.id === productId);
        if (!line) {
            return;
        }

        if (quantity <= 0) {
            cart.value = cart.value.filter((item) => item.product.id !== productId);
            return;
        }

        if (line.product.stock >= 0 && quantity > line.product.stock) {
            void showError("Requested quantity is higher than current stock.");
            return;
        }

        line.quantity = quantity;
    };

    const removeFromCart = (productId: number) => {
        cart.value = cart.value.filter((item) => item.product.id !== productId);
    };

    const resetCheckout = () => {
        cart.value = [];
        checkoutForm.value = createDefaultCheckoutForm();
    };

    const submitOrder = async () => {
        if (!catalog.value.shop) {
            await showError("Shop details are unavailable.");
            return;
        }

        if (!checkoutForm.value.customerName.trim()) {
            await showError("Customer name is required.");
            return;
        }

        if (!cart.value.length) {
            await showError("Add at least one item to the cart.");
            return;
        }

        isSubmitting.value = true;
        try {
            const payload: GuestOrderPayload = {
                shopId: catalog.value.shop.id,
                customerName: checkoutForm.value.customerName.trim(),
                customerPhone: checkoutForm.value.customerPhone.trim() || undefined,
                customerEmail: checkoutForm.value.customerEmail.trim() || undefined,
                notes: checkoutForm.value.notes.trim() || undefined,
                type: checkoutForm.value.type,
                paymentMethod: checkoutForm.value.paymentMethod,
                items: cart.value.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            };

            const response = await createGuestOrder(payload);
            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            const orderNumber = response.data.orderNumber;
            resetCheckout();
            await loadCatalog();
            await showSuccess("Order placed successfully.");
            await navigateTo(`/shop/success?orderNumber=${encodeURIComponent(orderNumber)}`);
        } catch (error) {
            await showError(error instanceof Error ? error.message : "Unable to place the order.");
        } finally {
            isSubmitting.value = false;
        }
    };

    onMounted(loadCatalog);

    return {
        catalog,
        isLoading,
        isSubmitting,
        selectedCategoryId,
        search,
        cart,
        checkoutForm,
        filteredProducts,
        cartCount,
        subtotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        submitOrder,
    };
};
