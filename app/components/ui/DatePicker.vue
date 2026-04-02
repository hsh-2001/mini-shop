<template>
  <el-date-picker
    class="date-picker"
    v-model="dateRange"
    :type="type"
    :shortcuts="isShortcuts ? shortcuts : []"
    range-separator="To"
    :start-placeholder="$t('Start Date')"
    :end-placeholder="$t('End Date')"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  startDate: Date;
  endDate: Date;
  isShortcuts?: boolean;
  type: "date" | "datetime" | "daterange" | "datetimerange";
}>();

const emits = defineEmits<{
  (event: "update:startDate", value: Date): void;
  (event: "update:endDate", value: Date): void;
}>();

const dateRange = computed<[Date, Date] | Date>({
  get: () =>
    ["date", "datetime"].includes(props.type)
      ? props.startDate
      : ([props.startDate, props.endDate] as [Date, Date]),
  set(value: [Date, Date] | Date) {
    if (["date", "datetime"].includes(props.type)) {
      emits("update:startDate", value as Date);
    } else {
      emits("update:startDate", (value as [Date, Date])[0]);
      emits("update:endDate", (value as [Date, Date])[1]);
    }
  },
});

const { t } = useI18n();
const startDay = new Date(new Date().setHours(0, 0, 0, 0));
const endDay = new Date(new Date().setHours(23, 59, 59, 999));
const shortcuts = computed(() => [
  {
    text: t("All"),
    value: () => {
      const start = new Date("2026-01-01");
      const end = endDay;
      return [start, end];
    },
  },
  {
    text: t("Today"),
    value: () => {
      const start = startDay;
      const end = endDay;
      return [start, end];
    },
  },
  {
    text: t("Yesterday"),
    value: () => {
      const end = new Date(endDay);
      end.setTime(end.getTime() - 3600 * 1000 * 24);
      const start = new Date(startDay);
      start.setTime(start.getTime() - 3600 * 1000 * 24);
      return [start, end];
    },
  },
  {
    text: t("This week"),
    value: () => {
      const end = new Date(endDay);
      const start = new Date(startDay);
      const day = end.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      start.setTime(start.getTime() - 3600 * 1000 * 24 * diffToMonday);
      end.setTime(end.getTime() + 3600 * 1000 * 24 * (6 - diffToMonday));
      return [start, end];
    },
  },
  {
    text: t("Last week"),
    value: () => {
      const end = new Date(endDay);
      const start = new Date(startDay);
      const day = end.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      start.setTime(start.getTime() - 3600 * 1000 * 24 * (diffToMonday + 7));
      end.setTime(end.getTime() - 3600 * 1000 * 24 * (diffToMonday + 1));
      return [start, end];
    },
  },
  {
    text: t("Last month"),
    value: () => {
      const firstDateOfLastMonth = new Date(startDay);
      firstDateOfLastMonth.setDate(1);
      firstDateOfLastMonth.setMonth(firstDateOfLastMonth.getMonth() - 1);
      const lastDateOfLastMonth = new Date(endDay);
      lastDateOfLastMonth.setDate(0);
      return [firstDateOfLastMonth, lastDateOfLastMonth];
    },
  },
  {
    text: t("Last 3 months"),
    value: () => {
      const firstDateOfLast3Months = new Date(startDay);
      firstDateOfLast3Months.setDate(1);
      firstDateOfLast3Months.setMonth(firstDateOfLast3Months.getMonth() - 3);
      const lastDateOfLastMonth = new Date(endDay);
      lastDateOfLastMonth.setDate(0);
      return [firstDateOfLast3Months, lastDateOfLastMonth];
    },
  },
]);
</script>
