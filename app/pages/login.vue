<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <el-card class="w-full max-w-md rounded-2xl! shadow-lg">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-semibold text-slate-800">{{ $t("Welcome Back") }}</h1>
        <p class="text-sm text-slate-500">{{ $t("Login to your account") }}</p>
      </div>
      <el-form
        :model="loginModel"
        :rules="rules"
        ref="formRef"
        label-position="top"
      >
        <el-form-item :label="$t('Username or Phone')" prop="identifier">
          <el-input
            v-model="loginModel.identifier"
            :placeholder="$t('Enter username or phone')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('Password')" prop="password">
          <el-input
            v-model="loginModel.password"
            type="password"
            :placeholder="$t('Enter password')"
            show-password
          />
        </el-form-item>

        <div class="flex justify-between items-center mb-4 text-sm">
          <el-checkbox v-model="remember">{{ $t("Remember me") }}</el-checkbox>
          <el-link type="primary">{{ $t("Forgot password?") }}</el-link>
        </div>

        <el-form-item>
          <el-button
            type="primary"
            class="w-full"
            :loading="isLoading"
            @click="onSubmit"
          >
            {{ $t("Login") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { t } = useI18n();

definePageMeta({
  layout: "guest",
});

const { loginModel, handleLogin, isLoading } = useAuth();

const formRef = ref();
const remember = ref(false);

const rules = {
  identifier: [
    {
      required: true,
      message: t("Please enter username or phone"),
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: t("Please enter password"), trigger: "blur" },
    {
      min: 4,
      message: t("Password must be at least 4 characters"),
      trigger: "blur",
    },
  ],
};

const onSubmit = async () => {
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    await handleLogin();
  });
};
</script>
