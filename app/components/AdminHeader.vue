<template>
    <div class="flex w-full justify-between py-2 bg-gray-100 border-b border-gray-300">
        <div class="flex items-center h-16 px-4 text-lg font-bold text-gray-800">
            {{ $t('Admin') }}
        </div>
        <div>
            <select v-model="selectedLanguage" @change="onChangeLanguage(selectedLanguage)" id="">
                <option value="en">English</option>
                <option value="km">ខ្មែរ</option>
            </select>
        </div>

    </div>
</template>

<script setup lang="ts">
const {
    onChangeLanguage,
    selectedLanguage,
} = useNavbar();

</script>

<style scoped></style>