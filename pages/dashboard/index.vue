<template>
    <div>
        <h1>Hola {{ userStore.user?.name ?? 'User' }}</h1>
    </div>
</template>
<script setup>
const userStore = useUserStore();
</script>