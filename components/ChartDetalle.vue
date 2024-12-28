<template>
    <div>
        <el-button type="primary" @click="open=true">Estadísticas</el-button>
        <el-dialog v-model="open" title="Estadísticas detalles" :append-to-body="true">
            <apexchart type="donut" :options="chartOptions" :series="chartSeries" />
            <apexchart type="donut" :options="chartOptionsCobros" :series="chartSeriesCobros" />
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const open = ref(false);

const props = defineProps({
  detalles: { type: Array, required: true },
});

const chartCategories = computed(() =>
  props.detalles.slice(0, 6).map((item) => item.detalle)
);
const chartSeries = computed(() =>
  props.detalles.slice(0, 6).map((item) => Number(item.monto))
);

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    id: 'donut-chart-1', 
  },
  labels: chartCategories.value,
  legend: {
    position: 'bottom',
  },
}));

const chartCategoriesCobros = computed(() =>
  props.detalles.slice(6).map((item) => item.detalle) 
);
const chartSeriesCobros = computed(() =>
  props.detalles.slice(6).map((item) => Number(item.monto))
);

const chartOptionsCobros = computed(() => ({
  chart: {
    type: 'donut',
    id: 'donut-chart-2', 
  },
  labels: chartCategoriesCobros.value,
  legend: {
    position: 'bottom',
  },
}));
</script>
