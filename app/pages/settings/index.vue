<template>
  <div class="w-full h-full">
    <el-card class="w-full h-full" shadow="never">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-xl font-bold">{{ $t("Settings") }}</h2>
          <div class="flex justify-end gap-2">
            <el-button
              type="primary"
              size="small"
              @click="() => (changePasswordVisible = true)"
              >{{ $t("Change Password") }}</el-button
            >
            <el-button
              type="primary"
              size="small"
              v-if="!isEditting"
              @click="isEditting = true"
              >{{ $t("Edit") }}</el-button
            >
            <template v-else>
              <div class="flex justify-end gap-2">
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
        </div>
      </template>
      <div class="flex flex-col gap-2 p-4">
        <el-form
          label-position="top"
          :model="model"
          class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
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
  <ChangePasswordDialog
    v-model:visible="changePasswordVisible"
    v-model:model="changePasswordModel"
    :is-loading="isLoading"
    :password-rules="passwordRules"
    @change-password="onSubmitChange"
  />
</template>

<script setup lang="ts">
import ChangePasswordDialog from "~/components/settings/ChangePasswordDialog.vue";

const {
  getShopSetting,
  model,
  isEditting,
  updateShopSetting,
  changePasswordVisible,
  changePasswordModel,
  isLoading,
  passwordRules,
  onSubmitChange,
} = useSetting();

onMounted(() => {
  getShopSetting();
});
</script>

<style scoped></style>
