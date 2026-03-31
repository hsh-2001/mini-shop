<template>
  <el-dialog
    :model-value="open"
    :title="form.id ? $t('Update Product') : $t('Add Product')"
    width="680px"
    destroy-on-close
    top="20px"
    @update:model-value="emit('update:open', $event)"
    @closed="onCloseDailog"
  >
    <el-alert
      v-if="!canCreate"
      :title="$t('Create at least one category before adding products.')"
      type="warning"
      :closable="false"
      class="mb-4"
    />

    <div class="w-full max-h-[70dvh] overflow-auto pr-1">
      <el-form
        :model="modelForm"
        label-position="top"
        @submit.prevent="emit('submit')"
      >
        <el-form-item :label="$t('Name')" required>
          <el-input
            v-model="modelForm.name"
            :placeholder="$t('Product name')"
          />
        </el-form-item>

        <div class="grid gap-4 md:grid-cols-2">
          <el-form-item :label="$t('Category')">
            <el-select
              v-model="modelForm.categoryId"
              :placeholder="$t('Uncategorized')"
              class="w-full"
              clearable
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="String(category.id)"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('Base Price')" required>
            <el-input
              v-model="modelForm.basePrice"
              :placeholder="$t('0.00')"
              @input="modelForm.basePrice = formatInputNumber($event)"
            />
          </el-form-item>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <el-form-item :label="$t('SKU')">
            <el-input
              v-model="modelForm.sku"
              :placeholder="$t('Example SKU')"
            />
          </el-form-item>

          <el-form-item :label="$t('Barcode')">
            <el-input
              v-model="modelForm.barcode"
              :placeholder="$t('Optional')"
            />
          </el-form-item>
        </div>

        <el-form-item :label="$t('Stock')">
          <div class="flex gap-2 items-center">
            <div class="w-80">
              <el-switch
                v-model="isLimitStock"
                :active-text="$t('Limited')"
                :inactive-text="$t('No Limit')"
              />
            </div>
            <el-input
              v-if="isLimitStock"
              v-model="modelForm.stock"
              @input="
                modelForm.stock = Number(formatInputNumber($event, false))
              "
            />
          </div>
        </el-form-item>

        <el-form-item :label="$t('Description')">
          <el-input
            v-model="modelForm.description"
            type="textarea"
            :rows="4"
            :placeholder="$t('Short product note')"
          />
        </el-form-item>
        <el-form-item :label="$t('Image')">
          <el-upload
            class="avatar-uploader"
            :on-success="handleUpdate"
            :show-file-list="false"
            :accept="'image/*'"
            @change="handleFileChange"
          >
            <img
              v-if="imageUrl.length || modelForm.imageUrl"
              :src="
                imageUrl.length
                  ? imageUrl
                  : getImageUrl(modelForm.imageUrl ?? '') || ''
              "
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="emit('update:open', false)">{{
          $t("Cancel")
        }}</el-button>
        <el-button
          type="primary"
          :loading="saving"
          :disabled="!canCreate"
          @click="emit('submit')"
        >
          {{ form.id ? $t("Update Product") : $t("Add Product") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UploadProps } from "element-plus";
import type { CategoryItem, ProductPayload } from "~/model/inventory";

const isLimitStock = ref(false);
const props = defineProps<{
  open: boolean;
  saving: boolean;
  canCreate: boolean;
  categories: CategoryItem[];
  form: ProductPayload;
  productFile: File | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  closed: [];
  submit: [];
  "update:form": [value: ProductPayload];
  "update:productFile": [value: File | null];
}>();

const modelForm = computed({
  get: () => props.form,
  set: (value) => emit("update:form", value),
});

watch(
  () => modelForm.value.stock,
  (newValue) => {
    isLimitStock.value = newValue?.toString() === "-1" ? false : true;
  },
);

watch(
  () => isLimitStock.value,
  (newValue) => {
    if (!newValue) {
      modelForm.value.stock = -1;
    } else if (modelForm.value.stock === -1) {
      modelForm.value.stock = 0;
    }
  },
);

const imageUrl = ref<string>("");
const handleFileChange: UploadProps["onChange"] = (file) => {
  emit("update:productFile", file.raw ?? null);
  imageUrl.value = file.raw ? URL.createObjectURL(file.raw) : "";
};

const handleUpdate: UploadProps["onSuccess"] = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const onCloseDailog = () => {
  imageUrl.value = "";
  emit("closed");
};
</script>

<style>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
