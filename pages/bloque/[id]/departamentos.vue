<template>
    <div>
        <h3 class="text-center text-slate-700 mb-3 text-xl">BLOQUE </h3>
        
        <el-input 
          v-model="buscar" 
          style="width: 240px" 
          placeholder="Buscar departamento" 
          @input="filterDepartamentos"
        />

        <el-table :data="filteredDepartamentos" height="600" v-if="departamentos.length>0">
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
  const buscar = ref('')
  const departamentos = ref([])
  const filteredDepartamentos = ref([]);

  async function departamentosList() {
    try {
      const response = await $fetch(`${config.public.apiBase}/bloque/${route.params.id}/departamentos`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`, 
        },
      });

      departamentos.value = response;
      filteredDepartamentos.value=response
    } catch (err) {
      console.error('Error inesperado:', err); 
    }
  }

function filterDepartamentos() {
    if (!buscar.value) {
        filteredDepartamentos.value = departamentos.value; 
    } else {
        filteredDepartamentos.value = departamentos.value.filter(departamento =>
            departamento.departamento.toLowerCase().includes(buscar.value.toLowerCase())
        );
    }
}
onMounted(departamentosList);
</script>