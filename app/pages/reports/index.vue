<template>
  <div class="w-full h-full">
    <el-card class="w-full h-full">
      <template #header>
        <div class="flex justify-between w-full mb-2">
          <h2 class="text-lg font-bold">{{ $t("Sales Report") }}</h2>
          <div class="flex justify-end gap-2">
            <el-button type="primary" @click="getReport">{{
              $t("Refresh")
            }}</el-button>
          </div>
        </div>
        <div class="bg-primary/10 p-2 rounded-md">
          <el-form
            :model="filterForm"
            :inline="!isMobile"
            class="flex flex-wrap gap-2"
          >
            <el-form-item :label="$t('Filter Date')">
              <template v-if="isMobile">
                <div class="flex items-center flex-wrap gap-2">
                  <el-date-picker
                    v-model="filterForm.startDate"
                    type="datetime"
                  />
                  <p>{{ $t("to") }}</p>
                  <el-date-picker
                    v-model="filterForm.endDate"
                    type="datetime"
                    :disabled-date="
                      (date: Date) => {
                        return date <= filterForm.startDate;
                      }
                    "
                  />
                </div>
              </template>
              <DatePicker
                v-else
                v-model:startDate="filterForm.startDate"
                v-model:endDate="filterForm.endDate"
                is-shortcuts
                type="datetimerange"
                class="w-100!"
              />
            </el-form-item>
            <el-form-item :label="$t('Payment Status')" class="w-60">
              <el-select
                v-model="filterForm.paymentStatus"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="option in paymentStatusOptions"
                  :key="option.value"
                  :label="$t(option.label)"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Order Status')" class="w-60">
              <el-select
                v-model="filterForm.orderStatus"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="option in orderStatusOptions"
                  :key="option.value"
                  :label="$t(option.label)"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getReport">{{
                $t("Search")
              }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <el-table
        :data="salesReport"
        border
        class="w-full h-[70dvh]"
        v-loading="isLoading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="customer.name" :label="$t('Customer')" />
        <el-table-column
          prop="getFinalAmount"
          :label="$t('Total Amount')"
          width="150"
        />
        <el-table-column prop="tax" :label="$t('Tax')" width="70" />
        <el-table-column
          prop="getCreatedOn"
          :label="$t('Created On')"
          width="200"
        />
        <el-table-column :label="$t('Items')" width="200">
          <template #default="{ row }">
            <ul v-for="value in row.orderItems" :key="value.id">
              <li>{{ value.product.name }} x {{ value.quantity }}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('Type')" width="100">
          <template #default="{ row }">
            {{
              $t(
                customerTypeOptions.find((o) => o.value === row.type)?.label ||
                  row.type,
              )
            }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('Status')" width="130">
          <template #default="{ row }">
            {{
              $t(
                orderStatusOptions.find((o) => o.value === row.status)?.label ||
                  row.status,
              )
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Payment Status')" width="150">
          <template #default="{ row }">
            {{
              $t(
                paymentStatusOptions.find((o) => o.value === row.paymentStatus)
                  ?.label || row.paymentStatus,
              )
            }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import DatePicker from "~/components/ui/DatePicker.vue";
import {
  customerTypeOptions,
  orderStatusOptions,
  paymentStatusOptions,
} from "~/constants/common";

const { getReport, salesReport, filterForm, isLoading } = useReport();
onMounted(async () => {
  await getReport();
});

const { isMobile } = deviceHelper();
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0 !important;
}
.el-form--inline .el-form-item {
  margin-right: 10px !important;
}
</style>
