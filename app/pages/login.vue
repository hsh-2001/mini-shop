<template>
    <div class="w-full h-screen flex items-center justify-center">
        <form action="#" class="p-4 bg-slate-100 text-slate-800 rounded-md shadow-md w-full max-w-sm">
            <input v-model="loginModel.identifier" type="text" placeholder="Username or phone"
                class="border p-2 mb-4 w-full">
            <input v-model="loginModel.password" type="password" placeholder="Password" class="border p-2 mb-4 w-full">
            <div class="w-full flex justify-end">
                <button @click.prevent="handleLogin" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">

const {
    loginModel,
    handleLogin,
} = useAuth();

</script>

<style scoped></style>