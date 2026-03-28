import { ElMessage, ElMessageBox } from "element-plus";
import type { CategoryItem, ProductItem, ProductPayload } from "~/model/inventory";
import {
    deleteProduct,
    fetchCategories,
    fetchCurrentUser,
    fetchProducts,
    saveProduct,
} from "~/utils/apiCalling";

const showError = (message: string) => {
    if (import.meta.client) {
        ElMessage.error(message);
        return;
    }
    console.error(message);
};

const showSuccess = (message: string) => {
    if (import.meta.client) {
        ElMessage.success(message);
    }
};

const showWarning = (message: string) => {
    if (import.meta.client) {
        ElMessage.warning(message);
    }
};

const createDefaultForm = (): ProductPayload => ({
    name: "",
    categoryId: null,
    description: "",
    basePrice: 0,
    sku: "",
    barcode: "",
    stock: -1,
});

export const useProductsPage = () => {
    const { t } = useI18n();
    const categories = ref<CategoryItem[]>([]);
    const products = ref<ProductItem[]>([]);
    const isLoading = ref(true);
    const isSaving = ref(false);
    const isDeleting = ref(false);
    const isDialogOpen = ref(false);
    const keyword = ref("");
    const currentPage = ref(1);
    const pageSize = ref(10);
    const shopLabel = ref("Loading shop...");
    const form = ref<ProductPayload>(createDefaultForm());

    const pagedProducts = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return products.value.slice(start, end);
    });

    const canCreate = computed(() => categories.value.length > 0);

    const resetForm = () => {
        form.value = createDefaultForm();
    };

    const setForm = (value: ProductPayload) => {
        form.value = value;
    };

    const openCreateDialog = () => {
        resetForm();
        isDialogOpen.value = true;
    };

    const editProduct = (product: ProductItem) => {
        form.value = {
            id: product.id,
            name: product.name,
            categoryId: product.categoryId,
            description: product.description ?? "",
            basePrice: Number(product.basePrice),
            sku: product.sku ?? "",
            barcode: product.barcode ?? "",
            stock: product.stock,
        };
        isDialogOpen.value = true;
    };

    const loadProducts = async () => {
        const response = await fetchProducts(keyword.value || undefined);
        products.value = response.data ?? [];
        currentPage.value = 1;
    };

    const loadContext = async () => {
        isLoading.value = true;
        try {
            const [user, categoryResponse] = await Promise.all([
                fetchCurrentUser(),
                fetchCategories(),
            ]);

            shopLabel.value = user?.shop?.name ?? user?.username ?? "Current Shop";
            categories.value = categoryResponse.data ?? [];
            await loadProducts();
        } catch (error) {
            showError(error instanceof Error ? error.message : t("Unable to load products."));
        } finally {
            isLoading.value = false;
        }
    };

    const submitProduct = async () => {
        if (!canCreate.value) {
            showWarning(t("Create at least one category before adding products."));
            return;
        }

        isSaving.value = true;
        try {
            const response = await saveProduct(form.value);
            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            await loadProducts();
            isDialogOpen.value = false;
            resetForm();
            showSuccess(t("Product saved."));
        } catch (error) {
            showError(error instanceof Error ? error.message : t("Unable to save product."));
        } finally {
            isSaving.value = false;
        }
    };

    const removeProduct = async (id: number) => {
        if (isDeleting.value) {
            return;
        }

        isDeleting.value = true;
        try {
            await ElMessageBox.confirm(t("Delete this product?"), t("Confirm"), {
                type: "warning",
            });

            const response = await deleteProduct(id);
            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            if (form.value.id === id) {
                resetForm();
            }
            await loadProducts();
            showSuccess(t("Product deleted."));
        } catch (error) {
            if (error === "cancel") {
                return;
            }
            showError(error instanceof Error ? error.message : t("Unable to delete product."));
        } finally {
            isDeleting.value = false;
        }
    };

    watch(keyword, async () => {
        try {
            await loadProducts();
        } catch (error) {
            showError(error instanceof Error ? error.message : t("Unable to search products."));
        }
    });

    watch(pageSize, () => {
        currentPage.value = 1;
    });

    onMounted(loadContext);

    return {
        categories,
        products,
        isLoading,
        isSaving,
        isDeleting,
        isDialogOpen,
        keyword,
        currentPage,
        pageSize,
        shopLabel,
        form,
        pagedProducts,
        canCreate,
        setForm,
        resetForm,
        openCreateDialog,
        editProduct,
        submitProduct,
        removeProduct,
    };
};
