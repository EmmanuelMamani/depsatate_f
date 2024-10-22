<template>
    <div class="space-y-3">
          <div class="flex space-x-2 items-center">
            <label>N° Recibo:</label>
            <el-input v-model="props.recibo.recibo" style="width: 100px" :readonly="true" />
            <label>Nombre:</label>
            <el-input v-model="props.recibo.nombre" style="width: 200px" :readonly="true" />
          </div>
          <h3 class="text-lg text-slate-700 border-b border-slate-700">Detalle del recibo:</h3>
          <el-table :data="props.detalles" height="300" v-if="props.detalles.length > 0" class="w-full">
            <el-table-column prop="detalle" label="Detalle" />
            <el-table-column prop="monto" label="Monto" />
          </el-table>
          <h3 class="text-lg text-slate-700 border-b border-slate-700">Total:</h3>
          <div class="flex space-x-2 items-center">
            <label>Método de pago:</label>
            <el-input v-model="props.recibo.metodo_pago" style="width: 100px" :readonly="true" />
            <label>Total:</label>
            <el-input v-model="props.recibo.total" style="width: 100px" :readonly="true" />
          </div>
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
            }
        })
</script>