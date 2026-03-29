<template>
  <div class="h-screen flex flex-col bg-slate-100 text-slate-900">
    <AdminHeader />

    <div class="flex flex-1 overflow-hidden">
      <AdminSidebar />
      <div class="flex-1 p-2 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from "~/components/AdminHeader.vue";
import AdminSidebar from "~/components/AdminSidebar.vue";
</script>
