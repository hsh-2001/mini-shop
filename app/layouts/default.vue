<template>
    <div class="grid w-full h-full">
        <AdminHeader />
        <div class="flex">
            <AdminSidebar />
            <div class="w-full px-4 py-2">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AdminHeader from '~/components/AdminHeader.vue';
import AdminSidebar from '~/components/AdminSidebar.vue';
</script>



<style scoped></style>