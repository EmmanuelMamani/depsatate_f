<template>
    <div>
      <div class="flex space-x-3 my-3">
            <label for="">Mes:</label>
            <el-date-picker v-model="fecha" type="month" placeholder="Elije un mes" />
            <el-button type="primary" @click="recibosList">Aceptar</el-button>
      </div>
      <div class="flex space-x-3 my-3">
        <span class=" text-slate-700 mb-3 text-lg" >Total acumulado: {{ total }} Bs</span>
        <span class=" text-slate-700 mb-3 text-lg" >Saldo acumulado: {{ totalSaldo }} Bs</span>
      </div>
      <el-table :data="recibos" style="width: 100%" v-if="recibos.length>0">
          <el-table-column prop="recibo" label="Recibo"  />
          <el-table-column prop="fecha_recibo" label="Fecha"  />
          <el-table-column prop="mes_correspondiente" label="Mes correspondiente"  />
          <el-table-column prop="departamento" label="Departamento" />
          <el-table-column prop="bloque" label="Bloque" />
          <el-table-column prop="total" label="Total" />
          <el-table-column prop="saldo" label="Saldo" />
      </el-table>
    </div>
</template>
<script setup>

    const  recibos=ref([])
    const fecha=ref('')
    const userStore = useUserStore();
    const config = useRuntimeConfig();

    const totalSaldo = computed(() => {
      return recibos.value.reduce((total, recibo) => total + Number(recibo.saldo || 0), 0);
    });
    const total = computed(() => {
      return recibos.value.reduce((total, recibo) => total + Number(recibo.total || 0), 0);
    });

    async function recibosList() {
      const fecha_reporte=new Date(fecha.value)
      try {
          const response = await $fetch(`${config.public.apiBase}/recibos`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${userStore.token}`, 
            },
            body: {
                    fecha:`${fecha_reporte.getFullYear()}-${(fecha_reporte.getMonth() + 1).toString().padStart(2, '0')}`
            },
          });

          recibos.value = response
        } catch (err) {
          console.error('Error inesperado:', err); 
        }
      }
</script>