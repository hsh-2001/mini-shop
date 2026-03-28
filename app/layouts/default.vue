<template>
    <div class="grid w-full h-full">
        <AdminHeader />
        <slot />
    </div>
</template>

<script setup lang="ts">
import AdminHeader from '~/components/AdminHeader.vue';
</script>



<style scoped></style>