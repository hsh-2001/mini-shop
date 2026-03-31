import type { CategoryItem, CategoryPayload } from "~/model/inventory";
import { showFeedback } from "~/utils/feedback";
import { saveCategory } from "~/utils/apiCalling";

const showError = (message: string) => {
    return showFeedback("error", message);
};

const showSuccess = (message: string) => {
    return showFeedback("success", message);
};

const createDefaultForm = (): CategoryPayload => ({
    name: "",
    type: "DRINK",
    description: "",
});

export const useCategoriesPage = () => {
    const { t } = useI18n();
    const store = useAppStore();
    const { allCategories, setCategories } = store;
    const user = computed(() => store.user);
    const categories = ref<CategoryItem[]>(allCategories);
    const isLoading = ref(true);
    const isSaving = ref(false);
    const isDialogOpen = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const shopLabel = computed(() => t("Loading shop..."));
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

    const getAllCategories = async () => {
        isLoading.value = true;
        try {
            const response = await fetchCategories();
            if (!response.isSuccess) {
                throw new Error(response.message);
            }
            setCategories(response.data ?? []);
            categories.value = response.data ?? [];
        } catch (error) {
            console.log("Unable to load categories:", error);
        } finally {
            isLoading.value = false;
        }
    }

    const editCategory = (category: CategoryItem) => {
        form.value = {
            id: category.id,
            name: category.name,
            type: category.type,
            description: category.description ?? "",
        };
        isDialogOpen.value = true;
    };

    const submitCategory = async () => {
        isSaving.value = true;
        try {
            const response = await saveCategory(form.value);
            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            isDialogOpen.value = false;
            resetForm();
            await getAllCategories();
            await showSuccess(t("Category saved."));
        } catch (error) {
            await showError(error instanceof Error ? error.message : t("Unable to save category."));
        } finally {
            isSaving.value = false;
        }
    };

    watch(pageSize, () => {
        currentPage.value = 1;
    });

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
        getAllCategories,
    };
};
