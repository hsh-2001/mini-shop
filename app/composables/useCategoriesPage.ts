import { ElMessage } from "element-plus";
import type { CategoryItem, CategoryPayload } from "~/model/inventory";
import { fetchCategories, fetchCurrentUser, saveCategory } from "~/utils/apiCalling";

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

const createDefaultForm = (): CategoryPayload => ({
    name: "",
    type: "DRINK",
    description: "",
});

export const useCategoriesPage = () => {
    const { t } = useI18n();
    const categories = ref<CategoryItem[]>([]);
    const isLoading = ref(true);
    const isSaving = ref(false);
    const isDialogOpen = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const shopLabel = ref("Loading shop...");
    const form = ref<CategoryPayload>(createDefaultForm());

    const pagedCategories = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return categories.value.slice(start, end);
    });

    const resetForm = () => {
        form.value = createDefaultForm();
    };

    const setForm = (value: CategoryPayload) => {
        form.value = value;
    };

    const openCreateDialog = () => {
        resetForm();
        isDialogOpen.value = true;
    };

    const editCategory = (category: CategoryItem) => {
        form.value = {
            id: category.id,
            name: category.name,
            type: category.type,
            description: category.description ?? "",
        };
        isDialogOpen.value = true;
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
            currentPage.value = 1;
        } catch (error) {
            showError(error instanceof Error ? error.message : t("Unable to load categories."));
        } finally {
            isLoading.value = false;
        }
    };

    const submitCategory = async () => {
        isSaving.value = true;
        try {
            const response = await saveCategory(form.value);
            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            await loadContext();
            isDialogOpen.value = false;
            resetForm();
            showSuccess(t("Category saved."));
        } catch (error) {
            showError(error instanceof Error ? error.message : t("Unable to save category."));
        } finally {
            isSaving.value = false;
        }
    };

    watch(pageSize, () => {
        currentPage.value = 1;
    });

    onMounted(loadContext);

    return {
        categories,
        isLoading,
        isSaving,
        isDialogOpen,
        currentPage,
        pageSize,
        shopLabel,
        form,
        pagedCategories,
        setForm,
        resetForm,
        openCreateDialog,
        editCategory,
        submitCategory,
    };
};
