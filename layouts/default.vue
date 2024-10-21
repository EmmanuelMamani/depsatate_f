<template>
<div class="h-screen flex flex-col">
  <HeaderCom class="" />
  <div class="flex flex-1">
    <!-- Asegúrate de que el menú tenga h-full para ocupar el espacio vertical completo -->
    <Menu class="w-1/5 h-full"></Menu>
    <main class="w-full h-full p-3">
      <NuxtPage />
    </main>
  </div>
</div>

  </template>
<script setup>
  const userStore = useUserStore();
  onMounted(() => {
    userStore.startTokenRefresh();
  });
</script>

  