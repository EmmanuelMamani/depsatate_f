<template>
    <div>
        <h3 class="text-center text-xl text-sky-900">Reporte de recibos</h3>
        <div class="flex space-x-3 my-3">
            <label for="">Fecha inicio:</label><el-date-picker v-model="inicio" type="date" placeholder="Dia inicio" />
            <label for="">Fecha fin:</label><el-date-picker v-model="fin" type="date" placeholder="Dia fin" />
            <el-button type="primary" @click="detalles_fecha">Aceptar</el-button>
        </div>
        <div class="grid grid-cols-3 gap-3">
            <CardDetalle v-for="(detalle,index) in detalles" :key=index :detalle="detalle.detalle" :monto="Number(detalle.monto)" :icon="detalle.icono"  ></CardDetalle>
        </div>
    </div>
</template>
<script setup>

const userStore = useUserStore();
const config = useRuntimeConfig();
const detalles = ref([])
const inicio= ref( new Date().toLocaleDateString('en-CA'))
const fin = ref( new Date().toLocaleDateString('en-CA'))

async function detalles_fecha() {
    try {
      const response = await $fetch(`${config.public.apiBase}/recibo/reporte_detalles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userStore.token}`, 
        },
        body:{
            inicio:inicio.value,
            fin: fin.value
        }
      });

      detalles.value=response
    } catch (err) {
      console.error('Error inesperado:', err); 
    }
}

onMounted(detalles_fecha);

</script>