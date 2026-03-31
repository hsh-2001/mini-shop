<template>
  <el-dialog
    :model-value="visible"
    :title="$t('Change Password')"
    :width="isMobile ? '90%' : '400px'"
    centered
    destroy-on-close
    @close="$emit('update:visible', false)"
  >
    <el-form label-position="top" :model="form" class="w-full">
      <el-form-item :label="$t('Current Password')">
        <el-input
          v-model="form.currentPassword"
          :placeholder="$t('Current Password')"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('New Password')">
        <el-input
          v-model="form.newPassword"
          :placeholder="$t('New Password')"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('Confirm New Password')">
        <el-input
          v-model="form.confirmNewPassword"
          :placeholder="$t('Confirm New Password')"
          type="password"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="$emit('update:visible', false)">{{
          $t("Cancel")
        }}</el-button>
        <el-button type="primary" @click="$emit('change-password')" :loading="isLoading">{{
          $t("Change Password")
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const isMobile = useDevice().isMobile;
const props = defineProps<{
  visible: boolean;
  isLoading: boolean;
  model: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (
    e: "update:model",
    value: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    },
  ): void;
  (e: "change-password"): void;
}>();

const form = computed({
  get: () => props.model,
  set: (value) => emit("update:model", value),
});
</script>

<style scoped></style>
