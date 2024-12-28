<template>
    <div>
      <el-button type="primary" @click="open=true">Estadísticas</el-button>
      <el-dialog v-model="open" title="Estadísticas detalles" :append-to-body="true">
        <apexchart type="line" :options="chartOptions" :series="chartSeries" />
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const open = ref(false);
  const props = defineProps({
    bloque: { type: Number, required: true },
  });
  
  const data = ref([]);
  const chartSeries = ref([]);
  const chartOptions = ref({
    chart: {
      type: 'line', // Cambiar a 'line' para mostrar las líneas
      zoom: {
        type: 'xy',
      },
    },
    xaxis: {
      type: 'category',
      title: {
        text: 'Meses',
      },
    },
    yaxis: {
      title: {
        text: 'Monto',
      },
    },
    legend: {
      position: 'bottom',
    },
    markers: {
      size: 5, // Tamaño de los puntos
    },
    stroke: {
      curve: 'smooth', // Para suavizar las líneas
    },
  });
  
  async function fetchData() {
    try {
      const response = await $fetch(`${config.public.apiBase}/bloque/${props.bloque}/estadisticas`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userStore.token}`, // Añadir el token Bearer en los headers
        },
      });
  
      data.value = response;
  
      chartSeries.value = [
        {
          name: 'Total',
          type: 'line', // Definir el tipo de la serie como 'line' para dibujar líneas
          data: response.map((item) => ({ x: item.mes, y: Number(item.total) })),
        },
        {
          name: 'Pagado',
          type: 'line', // Definir el tipo de la serie como 'line' para dibujar líneas
          data: response.map((item) => ({ x: item.mes, y: Number(item.pagado) })),
        },
        {
          name: 'Saldo',
          type: 'line', // Definir el tipo de la serie como 'line' para dibujar líneas
          data: response.map((item) => ({ x: item.mes, y: Number(item.saldo) })),
        },
      ];
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }
  
  onMounted(fetchData);
  </script>
  