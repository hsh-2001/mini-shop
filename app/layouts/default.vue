<template>
  <div class="w-full bg-slate-100 text-slate-900">
    <div>
      <AdminHeader />
    </div>
    <div class="flex items-start w-full">
      <AdminSidebar />
      <div class="w-full h-full p-2 overflow-auto">
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
