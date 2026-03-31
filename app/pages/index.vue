<template>
  <div v-loading="isLoading" class="w-full h-full">
    <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <overview-card
        :title="$t('Total Sales')"
        :value="overview?.totalSalesForDisplay ?? 0"
        :icon="HandCoins"
      />
      <overview-card
        :title="$t('Total Products')"
        :value="overview.total_products ?? 0"
        :icon="Box"
      />
      <overview-card
        :title="$t('Total Orders')"
        :value="overview.total_orders ?? 0"
        :icon="ShoppingCart"
      />
    </div>
    <div class="max-w-md p-2 bg-gray-50 rounded-md">
      <h1 class="text-xl">{{ $t("Past 7 days sales") }}</h1>
      <canvas ref="myChart"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart } from "chart.js/auto";
import type { Chart as ChartInstance } from "chart.js";
import { HandCoins, Box, ShoppingCart } from "@lucide/vue";

const { overview, fetchOverview } = useOverview();

const myChart = ref<HTMLCanvasElement | null>(null);
const chart = ref<ChartInstance | null>(null);
const { t } = useI18n();
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const todayIndex = new Date().getDay();

const orderedDays = [
  ...days.slice(todayIndex + 1),
  ...days.slice(0, todayIndex + 1),
];

const labels = orderedDays.map((day) => t(day));

const isLoading = ref(false);
onMounted(async () => {
  isLoading.value = true;
  await fetchOverview();
  isLoading.value = false;
  if (myChart.value) {
    const ctx = myChart.value.getContext("2d");
    if (ctx) {
      chart.value = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: t("Sales"),
              data: overview.value?.past_7_days_sales.map(
                (item) => item.sales,
              ) ?? [12, 19, 3, 5, 2, 3, 7],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54,162,235,1)",
                "rgba(255,206,86,1)",
                "rgba(75,192,192,1)",
                "rgba(153,102,255,1)",
                "rgba(255,159,64,1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return formatCurrency(Number(value), "KHR");
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.raw || 0;
                  return formatCurrency(Number(value), "KHR");
                },
              },
            },
          },
        },
      });
    }
  }
});
</script>

<style scoped></style>
