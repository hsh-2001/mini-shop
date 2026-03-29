<template>
  <el-dialog
    :model-value="open"
    :title="form.id ? $t('Update Category') : $t('Add Category')"
    width="520px"
    destroy-on-close
    @update:model-value="emit('update:open', $event)"
    @closed="emit('closed')"
  >
    <el-form label-position="top" @submit.prevent="emit('submit')">
      <el-form-item :label="$t('Name')" required>
        <el-input
          :model-value="form.name"
          :placeholder="$t('Category name')"
          @update:model-value="updateField('name', $event)"
        />
      </el-form-item>

      <el-form-item :label="$t('Type')" required>
        <el-select
          :model-value="form.type"
          :placeholder="$t('Select type')"
          class="w-full"
          @update:model-value="updateField('type', $event)"
        >
          <el-option
            v-for="item in categoryTypes"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('Description')">
        <el-input
          :model-value="form.description"
          type="textarea"
          :rows="4"
          :placeholder="$t('Short category note')"
          @update:model-value="updateField('description', $event)"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="emit('update:open', false)">{{ $t("Cancel") }}</el-button>
        <el-button type="primary" :loading="saving" @click="emit('submit')">
          {{ form.id ? $t("Update Category") : $t("Add Category") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { CategoryType } from "~~/prisma/generated/enums";
import type { CategoryPayload } from "~/model/inventory";

const categoryTypes: Array<{ value: CategoryType; label: string }> = [
  { value: "DRINK", label: "Drink" },
  { value: "FOOD", label: "Food" },
  { value: "SUPPLY", label: "Supply" },
  { value: "BEAN", label: "Bean" },
  { value: "SYRUP", label: "Syrup" },
];

const props = defineProps<{
  open: boolean;
  saving: boolean;
  form: CategoryPayload;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  closed: [];
  submit: [];
  "update:form": [value: CategoryPayload];
}>();

const updateField = <K extends keyof CategoryPayload>(
  key: K,
  value: CategoryPayload[K],
) => {
  emit("update:form", {
    ...props.form,
    [key]: value,
  });
};
</script>
