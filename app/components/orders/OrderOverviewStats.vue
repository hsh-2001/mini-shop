<template>
  <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <article
      v-for="item in cards"
      :key="item.label"
      class="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{{ item.label }}</p>
          <p class="mt-3 text-3xl font-semibold text-slate-950">{{ item.value }}</p>
          <p class="mt-2 text-sm text-slate-500">{{ item.caption }}</p>
        </div>
        <div :class="item.iconWrapperClass" class="flex h-12 w-12 items-center justify-center rounded-2xl">
          <el-icon :size="22">
            <component :is="item.icon" />
          </el-icon>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { CircleCheck, Clock, Money, Tickets } from "@element-plus/icons-vue";
const { t } = useI18n();

const props = defineProps<{
  stats: {
    totalOrders: number;
    pendingCount: number;
    paidCount: number;
    todayCount: number;
    totalRevenue: number;
  };
}>();

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

const cards = computed(() => [
  {
    label: t("Visible orders"),
    value: props.stats.totalOrders.toString(),
    caption: t("Orders matching the current filters and search."),
    icon: Tickets,
    iconWrapperClass: "bg-slate-100 text-slate-700",
  },
  {
    label: t("Need attention"),
    value: props.stats.pendingCount.toString(),
    caption: t("Pending, confirmed, or preparing orders still in progress."),
    icon: Clock,
    iconWrapperClass: "bg-amber-100 text-amber-700",
  },
  {
    label: t("Paid orders"),
    value: props.stats.paidCount.toString(),
    caption: t("Orders already marked as fully paid."),
    icon: CircleCheck,
    iconWrapperClass: "bg-emerald-100 text-emerald-700",
  },
  {
    label: t("Visible revenue"),
    value: formatCurrency(props.stats.totalRevenue),
    caption: `${props.stats.todayCount} ${t("orders were created today.")}`,
    icon: Money,
    iconWrapperClass: "bg-blue-100 text-blue-700",
  },
]);
</script>
