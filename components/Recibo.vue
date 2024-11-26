<template>
    <div class="space-y-3">

          <div class="flex space-x-2 items-center">
            <label>N° Recibo:</label>
            <el-input v-model="props.recibo.recibo" style="width: 100px" :readonly="true" />
            <label>Nombre:</label>
            <el-input v-model="props.recibo.nombre" style="width: 200px" :readonly="true" />
            <label>Fecha:</label>
            <el-input v-model="props.recibo.fecha_recibo" style="width: 150px" :readonly="true" />
          </div>

          <div class="flex space-x-2 items-center">
            <label>Mes correspondiente:</label>
            <el-input v-model="props.recibo.mes_correspondiente" style="width: 100px" :readonly="true" />
          </div>

          <h3 class="text-lg text-slate-700 border-b border-slate-700">Detalle del recibo:</h3>
          <el-table :data="props.detalles"  v-if="props.detalles.length > 0" class="w-full">
            <el-table-column prop="detalle" label="Detalle" />
            <el-table-column prop="monto" label="Monto" />
          </el-table>

          <h3 class="text-lg text-slate-700 border-b border-slate-700">Total:</h3>
          <div class="flex space-x-2 items-center">
            <label>Pagado:</label>
              <el-input v-model="pagado" style="width: 50px" :readonly="true" />
            <label>Total:</label>
            <el-input v-model="props.recibo.total" style="width: 100px" :readonly="true" />
            <label>Saldo:</label>
            <el-input v-model="props.recibo.saldo" style="width: 100px" :readonly="true" />
          </div>

          <h3 class="text-lg text-slate-700 border-b border-slate-700">Nota:</h3>
          <el-input v-model="props.recibo.nota" class="w-full block" :rows="2" type="textarea" :readonly="true" />
        </div>
</template>
<script setup>
    const props = defineProps({
            recibo: {
                type: Object,
                required: true,
            },
            detalles:{
                type: Array,
                required:true
            },
        })
    const pagado = computed(() => (props.recibo.pagado ? 'Si' : 'No'));   
</script>