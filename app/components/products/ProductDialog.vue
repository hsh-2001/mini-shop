<template>
  <el-dialog
    :model-value="open"
    :title="form.id ? $t('Update Product') : $t('Add Product')"
    width="680px"
    destroy-on-close
    @update:model-value="emit('update:open', $event)"
    @closed="emit('closed')"
  >
    <el-alert
      v-if="!canCreate"
      :title="$t('Create at least one category before adding products.')"
      type="warning"
      :closable="false"
      class="mb-4"
    />

    <el-form label-position="top" @submit.prevent="emit('submit')">
      <el-form-item :label="$t('Name')" required>
        <el-input
          :model-value="form.name"
          :placeholder="$t('Product name')"
          @update:model-value="updateField('name', $event)"
        />
      </el-form-item>

      <div class="grid gap-4 md:grid-cols-2">
        <el-form-item :label="$t('Category')">
          <el-select
            :model-value="categoryIdModel"
            :placeholder="$t('Uncategorized')"
            class="w-full"
            clearable
            @update:model-value="updateCategory"
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
          <el-input-number
            :model-value="form.basePrice"
            :min="0"
            :step="0.01"
            controls-position="right"
            class="w-full"
            @update:model-value="updateField('basePrice', $event ?? 0)"
          />
        </el-form-item>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <el-form-item :label="$t('SKU')">
          <el-input
            :model-value="form.sku"
            :placeholder="$t('Example SKU')"
            @update:model-value="updateField('sku', $event)"
          />
        </el-form-item>

        <el-form-item :label="$t('Barcode')">
          <el-input
            :model-value="form.barcode"
            :placeholder="$t('Optional')"
            @update:model-value="updateField('barcode', $event)"
          />
        </el-form-item>
      </div>

      <el-form-item :label="$t('Stock')">
        <el-input-number
          :model-value="form.stock"
          :step="1"
          controls-position="right"
          class="w-full"
          @update:model-value="updateField('stock', $event ?? -1)"
        />
      </el-form-item>

      <el-form-item :label="$t('Description')">
        <el-input
          :model-value="form.description"
          type="textarea"
          :rows="4"
          :placeholder="$t('Short product note')"
          @update:model-value="updateField('description', $event)"
        />
      </el-form-item>
      <el-form-item :label="$t('Image')">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          @change="handleFileChange"
        >
          <img
            v-if="form.imageUrl || imageUrl"
            :src="form.imageUrl || imageUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

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

const categoryIdModel = computed(() =>
  props.form.categoryId ? String(props.form.categoryId) : "",
);

const updateField = <K extends keyof ProductPayload>(
  key: K,
  value: ProductPayload[K],
) => {
  emit("update:form", {
    ...props.form,
    [key]: value,
  });
};

const handleFileChange: UploadProps["onChange"] = (file) => {
  emit("update:productFile", file.raw ?? null);
};

const updateCategory = (value: string) => {
  emit("update:form", {
    ...props.form,
    categoryId: value ? Number(value) : null,
  });
};

const imageUrl = ref<string>("");
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile,
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
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
