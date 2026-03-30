<template>
  <div class="w-full h-full">
    <el-card class="w-full h-full" shadow="never">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-xl font-bold">{{ $t("Settings") }}</h2>
          <el-button
            type="primary"
            size="small"
            v-if="!isEditting"
            @click="isEditting = true"
            >{{ $t("Edit") }}</el-button
          >
          <template v-else>
            <div class="flex justify-end">
              <el-button
                @click="isEditting = false"
                size="small"
                v-if="isEditting"
                >{{ $t("Cancel") }}</el-button
              >
              <el-button
                type="primary"
                size="small"
                v-if="isEditting"
                @click="updateShopSetting"
                >{{ $t("Save") }}</el-button
              >
            </div>
          </template>
        </div>
      </template>
      <div class="flex flex-col gap-4">
        <el-form
          label-position="top"
          :model="model"
          class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <el-form-item :label="$t('Shop Name')">
            <el-input
              :disabled="!isEditting"
              v-model="model.name"
              :placeholder="$t('Shop Name')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('Login Name')">
            <el-input
              v-model="model.username"
              disabled
              :placeholder="$t('Login Name')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('Currency Base')">
            <el-input
              v-model="model.currencyBase"
              disabled
              :placeholder="$t('Currency Base')"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="model.currencyBase !== 'USD'"
            :label="$t('Exchange USD')"
          >
            <el-input
              type="number"
              :disabled="!isEditting"
              v-model="model.exchangeUSD"
              :placeholder="$t('Exchange USD')"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="model.currencyBase !== 'KHR'"
            :label="$t('Exchange KHR')"
          >
            <el-input
              :disabled="!isEditting"
              v-model="model.exchangeKHR"
              :placeholder="$t('Exchange KHR')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('Shop Description')">
            <el-input
              type="textarea"
              :rows="3"
              :disabled="!isEditting"
              v-model="model.description"
              :placeholder="$t('Shop Description')"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const { getShopSetting, model, isEditting, updateShopSetting } = useSetting();

onMounted(() => {
  getShopSetting();
});
</script>

<style scoped></style>
