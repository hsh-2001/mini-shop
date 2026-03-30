import type { CategoryItem, ProductItem, ProductPayload } from "~/model/inventory";
import { confirmWarning, showFeedback } from "~/utils/feedback";
import {
    deleteProduct,
    fetchCategories,
    fetchCurrentUser,
    callGetAllProducts,
    saveProduct,
} from "~/utils/apiCalling";

const showError = (message: string) => {
    return showFeedback("error", message);
};

const showSuccess = (message: string) => {
    return showFeedback("success", message);
};

const showWarning = (message: string) => {
    return showFeedback("warning", message);
};

const createDefaultForm = (): ProductPayload => ({
    name: "",
    imageUrl: null,
    categoryId: null,
    description: "",
    basePrice: 0,
    sku: "",
    barcode: "",
    stock: -1,
});

export const useProductsPage = () => {
    const { t } = useI18n();
    const store = useAppStore();
    const { allCategories } = storeToRefs(store);
    const products = ref<ProductItem[]>([]);
    const productFile = ref<File | null>(null);
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

    const canCreate = computed(() => allCategories.value.length > 0);

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
            imageUrl: product.imageUrl ?? null,
        };
        isDialogOpen.value = true;
    };

    const loadContext = async () => {
        isLoading.value = true;
        try {
            const response = await callGetAllProducts(keyword.value || undefined);
            products.value = response.data ?? [];
            store.setProducts(products.value);
            currentPage.value = 1;
        } catch (error) {
            await showError(error instanceof Error ? error.message : t("Unable to load products."));
        } finally {
            isLoading.value = false;
        }
    };

    const submitProduct = async () => {
        if (!canCreate.value) {
            await showWarning(t("Create at least one category before adding products."));
            return;
        }

        isSaving.value = true;
        try {
            const upload = await handleUploadImage(productFile.value, "products");
            if (upload) {
                form.value.imageUrl = upload.imageUrl;
            }
            const response = await saveProduct(form.value);
            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            await loadContext();
            isDialogOpen.value = false;
            resetForm();
            await showSuccess(t("Product saved."));
        } catch (error) {
            await showError(error instanceof Error ? error.message : t("Unable to save product."));
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
            const confirmed = await confirmWarning(t("Delete this product?"), t("Confirm"));
            if (!confirmed) {
                return;
            }

            const response = await deleteProduct(id);
            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            if (form.value.id === id) {
                resetForm();
            }
            await loadContext();
            await showSuccess(t("Product deleted."));
        } catch (error) {
            await showError(error instanceof Error ? error.message : t("Unable to delete product."));
        } finally {
            isDeleting.value = false;
        }
    };

    watch(keyword, async () => {
        try {
            await loadContext();
        } catch (error) {
            await showError(error instanceof Error ? error.message : t("Unable to search products."));
        }
    });

    watch(pageSize, () => {
        currentPage.value = 1;
    });

    onMounted(loadContext);

    return {
        categories: allCategories,
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
        productFile,
    };
};
