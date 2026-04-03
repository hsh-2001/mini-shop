<template>
  <div
    class="bg-white rounded-md h-[90dvh] overflow-hidden flex flex-col"
    :class="isMobile ? '' : 'border border-gray-200'"
  >
    <div
      class="flex flex-col gap-3 lg:flex-row lg:items-start  lg:justify-between p-2 transition-all duration-500 ease-in-out"
    >
      <div>
        <h2 class="text-lg font-semibold text-slate-900">
          {{ $t("Products") }}
        </h2>
        <div class="mt-2 flex flex-wrap gap-2">
          <el-tag size="small" round type="info">
            {{ categories.length }} {{ $t("categories") }}
          </el-tag>
          <el-tag size="small" round type="success">
            {{ products.length }} {{ $t("shown") }}
          </el-tag>
        </div>
      </div>

      <div class="flex w-full flex-col gap-2 lg:max-w-xl">
        <el-input
          :model-value="search"
          clearable
          :placeholder="$t('Search by name or SKU')"
          @update:model-value="emit('update:search', String($event ?? ''))"
        />

        <div class="flex flex-wrap gap-2">
          <el-button
            size="small"
            round
            :type="selectedCategoryId === 'all' ? 'primary' : 'default'"
            @click="emit('update:selectedCategoryId', 'all')"
          >
            {{ $t("All") }}
          </el-button>
          <el-button
            v-for="category in categories"
            :key="category.id"
            size="small"
            round
            :type="selectedCategoryId === category.id ? 'success' : 'default'"
            @click="emit('update:selectedCategoryId', category.id)"
          >
            {{ category.name }}
          </el-button>
          <el-button
            v-if="search || selectedCategoryId !== 'all'"
            size="small"
            text
            @click="resetFilters"
          >
            {{ $t("Reset") }}
          </el-button>
        </div>
      </div>
    </div>

    <div :loading="loading" class="h-full overflow-auto" ref="productListRef">
      <div
        v-if="products.length"
        class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-2"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="border p-2 rounded-md border-slate-300"
        >
          <div>
            <div class="product-photo">
              <div class="w-auto h-40">
                <img
                  :src="getImageUrl(product.imageUrl ?? '')"
                  alt="product-image"
                  @error="getFallbackImage"
                  class="w-full h-full object-cover rounded-md"
                />
              </div>
              <div class="mt-2 text-slate-500">
                <el-tag size="small" round type="danger">
                  {{ product.category?.name }}
                </el-tag>
              </div>
            </div>

            <div>
              <div class="text-md font-medium text-secondary mt-2">
                {{ product.name }}
              </div>
              <div class="flex justify-between text-[12px]">
                <p>{{ $t("Price") }}:</p>
                <div class="flex flex-col justify-end items-end">
                  <p>
                    {{
                      formatPrice(Number(product.basePrice), primaryCurrency)
                    }}
                  </p>
                  <p class="text-slate-400">
                    {{
                      formatPrice(Number(product.basePrice), secondaryCurrency)
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full flex mt-2">
              <el-button
                class="w-full"
                type="primary"
                :disabled="product.stock === 0"
                @click="emit('add', product)"
              >
                {{ $t("Add") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <el-empty
        v-else
        :description="$t('No products match the current filters.')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryItem, ProductItem } from "~/model/inventory";
import { formatCurrency } from "~/utils/currencyFormat";

defineProps<{
  loading: boolean;
  search: string;
  selectedCategoryId: number | "all";
  categories: CategoryItem[];
  products: ProductItem[];
}>();

const emit = defineEmits<{
  (event: "update:search", value: string): void;
  (event: "update:selectedCategoryId", value: number | "all"): void;
  (event: "add", value: ProductItem): void;
  (event: "remove-from-cart", value: number): void;
}>();

const store = useAppStore();
const primaryCurrency = computed(
  () => store.currentCurrency.currencyBase || "USD",
);
const secondaryCurrency = computed(() =>
  primaryCurrency.value === "USD" ? "KHR" : "USD",
);

const formatPrice = (amount: number, currency: string) =>
  formatCurrency(amount, currency);

const resetFilters = () => {
  emit("update:search", "");
  emit("update:selectedCategoryId", "all");
};

const { isMobile } = deviceHelper();

const isScrollDown = ref(false);
const productListRef = ref<HTMLDivElement | null>(null);

const lastScrollTop = ref(0);
const startScrollTop = ref(0);
const handleScroll = () => {
  const el = productListRef.value;
  if (!el) return;
  const scrollTop = el.scrollTop;
  const isDown = scrollTop > lastScrollTop.value;
  if (isDown !== lastScrollTop.value < startScrollTop.value) {
    startScrollTop.value = lastScrollTop.value;
  }

  const distance = Math.abs(scrollTop - startScrollTop.value);

  if (distance > 20) {
    isScrollDown.value = isDown;
    startScrollTop.value = scrollTop;
  }

  lastScrollTop.value = scrollTop;
};

onMounted(() => {
  const el = productListRef.value;
  if (!el) return;

  el.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  const el = productListRef.value;
  if (!el) return;

  el.removeEventListener("scroll", handleScroll);
});
</script>
