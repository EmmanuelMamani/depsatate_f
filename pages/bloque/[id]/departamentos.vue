<template>
    <div>
        <h3 class="text-center text-slate-700 mb-3 text-xl">BLOQUE {{ bloque }}</h3>
        <el-table height="600" :data="departamentos" >
            <el-table-column prop="departamento" label="Departamento"  />
            <el-table-column prop="mt2" label="MT2"  />
            <el-table-column prop="expensa" label="Expensas" />
            <el-table-column prop="propietario" label="Propietario"  />
            <el-table-column label="Estado" >
                <template #default="scope">
                    <el-tag  :type="scope.row.estado=='libre'?'success':'danger'" effect="dark">{{ scope.row.estado }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
const userStore = useUserStore();
const config = useRuntimeConfig();
const route = useRoute()

const departamentos = ref([])
const bloque = ref('')
async function departamentosList() {
  try {
    // Realiza la solicitud con $fetch
    const response = await $fetch(`${config.public.apiBase}/bloque/${route.params.id}/departamentos`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`, // Incluye el token en los encabezados
      },
    });

    // Asigna la respuesta a bloques
    departamentos.value = response; // Asigna directamente la respuesta
  } catch (err) {
    console.error('Error inesperado:', err); // Manejo de errores
  }
}
onMounted(departamentosList);
</script>