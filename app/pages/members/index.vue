<template>
  <div class="w-full h-full">
    <el-card shadow="never" class="w-full">
      <template #header>
        <div class="flex justify-between">
          <div>{{ $t("Members") }}</div>
          <div>
            <el-button type="primary" @click="dialogVisible = true">
              <el-icon class="mr-1"><Plus /></el-icon>
              {{ $t("Create Member") }}
            </el-button>
          </div>
        </div>
      </template>
      <el-table
        :data="members"
        stripe
        width="100%"
        v-loading="isLoading"
        :empty-text="$t('No members found yet.')"
      >
        <el-table-column
          :label="$t('Username')"
          prop="username"
          min-width="220"
        />
        <el-table-column :label="$t('Phone')" min-width="180" prop="phone" />
        <el-table-column :label="$t('Role')" min-width="180" prop="role">
          <template #default="{ row }">
            <el-tag
              :type="row.role === 'OWNER' ? 'danger' : 'success'"
              effect="light"
              round
              >{{ $t(row.role) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column :label="$t('Status')" min-width="180" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.isActive ? 'success' : 'danger'"
              effect="light"
              round
              >{{ $t(row.isActive ? "Active" : "Inactive") }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column :label="$t('Created On')" min-width="180">
          <template #default="{ row }">
            <p class="text-xs text-slate-500">
              {{ row.formattedCreatedOn }}
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Actions')" align="center" fixed="right">
          <template #default="{ row }">
            <Edit
              v-if="row.role !== UserRole.OWNER"
              class="cursor-pointer w-4 h-4 text-slate-500"
              @click="
                () => {
                  onEditMember(row);
                }
              "
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <el-dialog
    v-model="dialogVisible"
    destroy-on-close
    :width="isMobile ? '90%' : '600px'"
    :title="isEditting ? $t('Update Member') : $t('Create Member')"
    @close="handleClose"
  >
    <el-form
      :model="formModel"
      :rules="rules"
      ref="ruleFormRef"
      label-position="top"
      class="space-y-4"
    >
      <el-form-item :label="$t('Username')" prop="username">
        <el-input
          v-model="formModel.username"
          :placeholder="$t('Enter username')"
        />
      </el-form-item>
      <el-form-item :label="$t('Phone')" prop="phone">
        <el-input
          v-model="formModel.phone"
          :placeholder="$t('Enter phone number')"
        />
      </el-form-item>
      <el-form-item v-if="!isEditting" :label="$t('Password')" prop="password">
        <el-input
          v-model="formModel.password"
          type="password"
          :placeholder="$t('Enter password')"
        />
      </el-form-item>
      <el-form-item :label="$t('Role')" prop="role">
        <el-select v-model="formModel.role" :placeholder="$t('Select role')">
          <el-option :label="$t('Admin')" value="ADMIN" />
          <el-option :label="$t('Manager')" value="MANAGER" />
          <el-option :label="$t('Cashier')" value="CASHIER" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('Member Status')" prop="isActive">
        <el-switch
          v-model="formModel.isActive"
          :active-text="$t('Active')"
          :inactive-text="$t('Inactive')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("Cancel") }}</el-button>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">{{
          isEditting ? $t("Update") : $t("Create")
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Edit, Plus } from "@lucide/vue";
import { UserRole } from "~~/prisma/generated/enums";
const {
  members,
  getMember,
  dialogVisible,
  formModel,
  rules,
  ruleFormRef,
  onSubmit,
  onEditMember,
  isEditting,
  handleClose,
  isLoading,
} = useMember();

const { isMobile } = deviceHelper();

onMounted(() => {
  getMember();
});
</script>

<style scoped></style>
