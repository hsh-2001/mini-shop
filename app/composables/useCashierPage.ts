import { OrderType, PaymentMethod, PaymentStatus } from "~~/prisma/generated/enums";
import type { ProductItem } from "~/model/inventory";
import type { CashierOrderForm } from "~/model/order";
import { showFeedback } from "~/utils/feedback";
import {
    createCashierOrder,
} from "~/utils/apiCalling";

interface CartLine {
    product: ProductItem;
    quantity: number;
}

const createDefaultForm = (): CashierOrderForm => ({
    customerName: "Walk-in customer",
    customerPhone: "",
    customerEmail: "",
    notes: "",
    type: OrderType.IN_STORE,
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.UNPAID,
});

const showError = (message: string) => {
    return showFeedback("error", message);
};

const showSuccess = (message: string) => {
    return showFeedback("success", message);
};

export const useCashierPage = () => {
    const { t } = useI18n();
    const store = useAppStore();
    const shopLabel = ref(t("Loading shop..."));
    const categories = computed(() => store.allCategories);
    const search = ref("");
    const selectedCategoryId = ref<number | "all">("all");
    const cart = ref<CartLine[]>([]);
    const form = ref<CashierOrderForm>(createDefaultForm());
    const isLoading = ref(true);
    const isSubmitting = ref(false);

    const filteredProducts = computed(() => {
        const keyword = search.value.trim().toLowerCase();

        return store.allProducts.filter((product) => {
            if (product.isActive === false) {
                return false;
            }

            const matchesCategory = selectedCategoryId.value === "all"
                || product.categoryId === selectedCategoryId.value;
            const matchesKeyword = !keyword
                || product.name.toLowerCase().includes(keyword)
                || product.description?.toLowerCase().includes(keyword)
                || product.sku?.toLowerCase().includes(keyword);

            return matchesCategory && matchesKeyword;
        });
    });

    const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));
    const cartLineCount = computed(() => cart.value.length);
    const subtotal = computed(() => cart.value.reduce(
        (sum, item) => sum + Number(item.product.basePrice) * item.quantity,
        0,
    ));


    const addToCart = (product: ProductItem) => {
        const existing = cart.value.find((item) => item.product.id === product.id);
        const currentQuantity = existing?.quantity ?? 0;

        if (product.stock >= 0 && currentQuantity >= product.stock) {
            void showError(t("This product has reached its stock limit."));
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
        const target = cart.value.find((item) => item.product.id === productId);
        if (!target) {
            return;
        }

        if (quantity <= 0) {
            cart.value = cart.value.filter((item) => item.product.id !== productId);
            return;
        }

        if (target.product.stock >= 0 && quantity > target.product.stock) {
            void showError(t("Requested quantity is higher than current stock."));
            return;
        }

        target.quantity = quantity;
    };

    const removeFromCart = (productId: number) => {
        cart.value = cart.value.filter((item) => item.product.id !== productId);
    };

    const clearCart = () => {
        cart.value = [];
    };

    const resetForm = () => {
        form.value = createDefaultForm();
        clearCart();
    };

    const submitOrder = async () => {
        if (!cart.value.length) {
            await showError(t("Add at least one item to the cart."));
            return;
        }

        isSubmitting.value = true;
        try {
            const customerName = form.value.customerName.trim() || t("Walk-in customer");
            const response = await createCashierOrder({
                customerName,
                customerPhone: form.value.customerPhone.trim() || undefined,
                customerEmail: form.value.customerEmail.trim() || undefined,
                notes: form.value.notes.trim() || undefined,
                type: form.value.type,
                paymentMethod: form.value.paymentMethod,
                paymentStatus: form.value.paymentStatus,
                items: cart.value.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            });

            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            const orderNumber = response.data.orderNumber;
            await showSuccess(t("Order {orderNumber} created.", { orderNumber }));
            resetForm();
        } catch (error) {
            await showError(error instanceof Error ? error.message : t("Unable to create order."));
        } finally {
            isSubmitting.value = false;
        }
    };


    return {
        shopLabel,
        categories,
        search,
        selectedCategoryId,
        cart,
        form,
        isLoading,
        isSubmitting,
        filteredProducts,
        cartCount,
        cartLineCount,
        subtotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        submitOrder,
    };
};
