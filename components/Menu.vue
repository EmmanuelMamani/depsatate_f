<template>
  <div class="bg-slate-700" v-if="userStore.user">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#334155"
      class="el-menu-vertical-demo"
      :default-active="activeIndex"
      text-color="#fff"
    >
      <el-menu-item index="1">
        <nuxt-link to="/dashboard">Dashboard</nuxt-link>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>Bloques</template>
        <el-menu-item v-for="(bloque, index) in bloques" :key="index" :index="`2-${index + 1}`">
          <nuxt-link :to="`/bloque/${bloque.id}/departamentos`">Bloque {{ bloque.bloque }}</nuxt-link>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="3">
        <nuxt-link to="/recibo">Recibos Totales</nuxt-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
const activeIndex = ref('1');
const userStore = useUserStore();
const config = useRuntimeConfig();
const bloques = ref([]);

async function bloquesList() {
  try {
    // Realiza la solicitud con $fetch
    const response = await $fetch(`${config.public.apiBase}/bloque`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`, // Incluye el token en los encabezados
      },
    });

    // Asigna la respuesta a bloques
    bloques.value = response; // Asigna directamente la respuesta
  } catch (err) {
    console.error('Error inesperado:', err); // Manejo de errores
  }
}
onMounted(bloquesList);
</script>
