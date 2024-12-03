<template>
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-2">
        <div class="flex space-x-3 my-3">
          <label for="">Mes:</label>
          <el-date-picker v-model="fecha" type="month" placeholder="Elije un mes" />

          <label for="">bloque:</label>
          <el-select v-if="bloques.length > 0" v-model="bloque" placeholder="Elije un bloque" size="large" style="width: 240px">
            <el-option v-for="(bloque, index) in bloques" :key="index" :label="bloque.bloque" :value="bloque.id" />
          </el-select>
          
          <el-button type="primary" @click="reporte_mes">Aceptar</el-button>
          
          <ReciboPdfReport :recibos="filteredDepartamentos"></ReciboPdfReport>
          <ReciboExcelReport :recibos="filteredDepartamentos"></ReciboExcelReport>
        </div>
        <el-alert :title="error_reporte" v-if="error_reporte != ''" type="error" :closable="false" />
        <el-table :data="filteredDepartamentos" height="550" v-if="departamentos.length > 0" table-layout="auto">
          <el-table-column prop="departamento" label="Departamento" />
          <el-table-column prop="estado_dep" label="Estado Dep." />
          <el-table-column label="Estado" prop="estado" filterable :filters="estadoFilters" :filter-method="filterEstado" column-key="estado">
            <template #default="{ row }">
              <el-tag :type="getTagType(row.estado)" effect="dark">{{ row.estado }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="recibo" label="Recibo" />
          <el-table-column prop="fecha_recibo" label="Fecha" />
          <el-table-column prop="mes_correspondiente" label="Mes correspondiente" />
          <el-table-column prop="total" label="Total" />
          <el-table-column prop="saldo" label="Saldo" />
        </el-table>
      </div>
      <div>
        <h3 class="text-center block text-xl text-sky-900 ">Detalles Recibo</h3>
        <el-alert class="my-5 block" title="Los detalles de estos recibos sirven para hacer balance" type="info" :closable="false" />
        <div class="grid grid-cols-3 gap-3">
          <CardDetalle v-for="(detalle, index) in detalles" :key="index" :detalle="detalle.detalle" :monto="Number(detalle.monto)" :icon="detalle.icono"></CardDetalle>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>

  const userStore = useUserStore();
  const config = useRuntimeConfig();
  const fecha = ref('');
  const bloques = ref([]);
  const bloque = ref('');
  const error_reporte = ref('');
  const departamentos = ref([]);
  const detalles = ref([]);
  const selectedEstado = ref(null);
  
  const estadoFilters = [
    { text: 'Sin Recibo', value: 'sin recibo' },
    { text: 'Sin Pagar', value: 'sin pagar' },
    { text: 'Pagado', value: 'pagado' },
  ];
  

  const filterEstado = (value, row) => {
    selectedEstado.value = value; 
    return row.estado === value;
  };
  
 
  const filteredDepartamentos = computed(() => {
    if (!selectedEstado.value) {
      return departamentos.value;
    }
    return departamentos.value.filter(dep => dep.estado === selectedEstado.value);
  });
  
  async function bloquesList() {
    try {
      const response = await $fetch(`${config.public.apiBase}/bloque`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      });
      bloques.value = response;
    } catch (err) {
      console.error('Error inesperado:', err);
    }
  }
  
  async function reporte_mes() {
    if (fecha.value == '') {error_reporte.value = 'La fecha es obligatoria'; return;} else {error_reporte.value = '';}
    if (bloque.value == '') {error_reporte.value = 'El bloque es obligatorio';return;} else {error_reporte.value = '';}
    const fecha_reporte = new Date(fecha.value);
  
    try {
      const response = await $fetch(`${config.public.apiBase}/recibos_mes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        body: {
          fecha: `${fecha_reporte.getFullYear()}-${(fecha_reporte.getMonth() + 1).toString().padStart(2, '0')}`,
          bloque: bloque.value,
        },
      });
      if (response) {
        departamentos.value = response;
      }
    } catch (error) {
      ElNotification({
        title: 'Error',
        message: `Error inesperado`,
        type: 'error',
      });
    }
    try {
      const response = await $fetch(`${config.public.apiBase}/recibo/reporte_detalles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        body: {
          inicio: new Date(fecha_reporte.getFullYear(), fecha_reporte.getMonth(), 1).toISOString().split('T')[0],
          fin: new Date(fecha_reporte.getFullYear(), fecha_reporte.getMonth() + 1, 0).toISOString().split('T')[0],
          bloque: bloque.value,
        },
      });
      detalles.value = response;
    } catch (err) {
      console.error('Error inesperado:', err);
    }
  }
  
  function getTagType(estado) {
    switch (estado) {
      case 'sin recibo':
        return 'danger';
      case 'sin pagar':
        return 'warning';
      case 'pagado':
        return 'success';
      default:
        return '';
    }
  }
  

  onMounted(bloquesList);
  </script>
  