<template>
    <div>
      <el-empty description="Cargando Recibos..." v-if="recibos.length<=0" />
      <el-table :data="recibos" style="width: 100%" v-if="recibos.length>0">
          <el-table-column prop="recibo" label="Recibo"  />
          <el-table-column prop="departamento" label="Departamento" />
          <el-table-column prop="bloque" label="Bloque" />
          <el-table-column prop="total" label="Total" />
          <el-table-column prop="saldo" label="Saldo" />
      </el-table>
    </div>
</template>
<script setup>

    const  recibos=ref([])
    const userStore = useUserStore();
    const config = useRuntimeConfig();
    async function recibosList() {
      try {
          const response = await $fetch(`${config.public.apiBase}/recibos`, {
            headers: {
              Authorization: `Bearer ${userStore.token}`, 
            },
          });

          recibos.value = response
        } catch (err) {
          console.error('Error inesperado:', err); 
        }
      }
    onMounted(recibosList);
    
</script>