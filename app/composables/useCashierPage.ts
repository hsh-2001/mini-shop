import { OrderType, PaymentMethod } from "~~/prisma/generated/enums";
import type { CategoryItem, ProductItem } from "~/model/inventory";
import type { CashierOrderForm } from "~/model/order";
import { showFeedback } from "~/utils/feedback";
import {
    createCashierOrder,
    fetchCategories,
    fetchCurrentUser,
    fetchProducts,
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
    type: OrderType.TAKEAWAY,
    paymentMethod: PaymentMethod.CASH,
});

const showError = (message: string) => {
    return showFeedback("error", message);
};

const showSuccess = (message: string) => {
    return showFeedback("success", message);
};

export const useCashierPage = () => {
    const shopLabel = ref("Loading shop...");
    const categories = ref<CategoryItem[]>([]);
    const products = ref<ProductItem[]>([]);
    const search = ref("");
    const selectedCategoryId = ref<number | "all">("all");
    const cart = ref<CartLine[]>([]);
    const form = ref<CashierOrderForm>(createDefaultForm());
    const isLoading = ref(true);
    const isSubmitting = ref(false);

    const filteredProducts = computed(() => {
        const keyword = search.value.trim().toLowerCase();

        return products.value.filter((product) => {
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

    const loadPage = async () => {
        isLoading.value = true;
        try {
            const [user, categoriesResponse, productsResponse] = await Promise.all([
                fetchCurrentUser(),
                fetchCategories(),
                fetchProducts(),
            ]);

            if (!categoriesResponse.isSuccess) {
                throw new Error(categoriesResponse.message);
            }

            if (!productsResponse.isSuccess) {
                throw new Error(productsResponse.message);
            }

            shopLabel.value = user?.shop?.name ?? user?.username ?? "Current Shop";
            categories.value = categoriesResponse.data ?? [];
            products.value = productsResponse.data ?? [];
        } catch (error) {
            await showError(error instanceof Error ? error.message : "Unable to load cashier data.");
        } finally {
            isLoading.value = false;
        }
    };

    const addToCart = (product: ProductItem) => {
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
        const target = cart.value.find((item) => item.product.id === productId);
        if (!target) {
            return;
        }

        if (quantity <= 0) {
            cart.value = cart.value.filter((item) => item.product.id !== productId);
            return;
        }

        if (target.product.stock >= 0 && quantity > target.product.stock) {
            void showError("Requested quantity is higher than current stock.");
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
            await showError("Add at least one item to the cart.");
            return;
        }

        isSubmitting.value = true;
        try {
            const customerName = form.value.customerName.trim() || "Walk-in customer";
            const response = await createCashierOrder({
                customerName,
                customerPhone: form.value.customerPhone.trim() || undefined,
                customerEmail: form.value.customerEmail.trim() || undefined,
                notes: form.value.notes.trim() || undefined,
                type: form.value.type,
                paymentMethod: form.value.paymentMethod,
                items: cart.value.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            });

            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            const orderNumber = response.data.orderNumber;
            await showSuccess(`Order ${orderNumber} created.`);
            resetForm();
            await loadPage();
        } catch (error) {
            await showError(error instanceof Error ? error.message : "Unable to create order.");
        } finally {
            isSubmitting.value = false;
        }
    };

    onMounted(loadPage);

    return {
        shopLabel,
        categories,
        products,
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
