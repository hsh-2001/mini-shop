<template>
  <div class="w-full bg-slate-100 text-slate-900">
    <AdminHeader />
    <div class="flex items-start p-0 w-full">
      <div class="w-auto">
        <AdminSidebar />
      </div>
      <div class="w-full px-4 py-4 overflow-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from "~/components/AdminHeader.vue";
import AdminSidebar from "~/components/AdminSidebar.vue";
</script>

<style scoped></style>
