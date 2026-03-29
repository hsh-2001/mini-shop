<template>
    <div class="flex w-full justify-between h-10 items-center bg-white shadow sticky top-0 z-10">
        <div class="flex gap-2 items-center px-4 text-lg font-bold text-gray-800">
            <button @click="() => store.isSidebarOpen = !store.isSidebarOpen" class="rounded-full p-1 bg-white border border-gray-200">
                <ChevronLeft v-if="store.isSidebarOpen" class="h-4 w-4" />
                <Menu v-else class="h-4 w-4" />
            </button>
            {{ $t('Admin') }}
        </div>
        <div class="mr-2">
            <ClientOnly>
                <el-select size="small" v-model="selectedLanguage" placeholder="Select" style="width: 100px">
                    <el-option v-for="item in languageOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </ClientOnly>
        </div>
</div>
</template>

<script setup lang="ts">
import { Menu, ChevronLeft} from '@lucide/vue';
const {
    selectedLanguage,
} = useNavbar();

const store = useAppStore();

const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'km', label: 'ខ្មែរ' },
] as const;

</script>

<style scoped></style>
