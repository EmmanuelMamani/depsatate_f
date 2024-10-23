<template>
    <div class="space-y-3">
          <div class="flex space-x-2 items-center">
            <label>N° Recibo:</label>
            <el-input v-model="props.recibo.recibo" style="width: 100px" :readonly="true" />
            <label>Nombre:</label>
            <el-input v-model="props.recibo.nombre" style="width: 200px" :readonly="true" />
          </div>
          <h3 class="text-lg text-slate-700 border-b border-slate-700">Detalle del recibo:</h3>
          <el-table :data="props.detalles"  v-if="props.detalles.length > 0" class="w-full">
            <el-table-column prop="detalle" label="Detalle" />
            <el-table-column prop="monto" label="Monto" />
          </el-table>
          <h3 class="text-lg text-slate-700 border-b border-slate-700">Total:</h3>
          <div class="flex space-x-2 items-center">
            <label>Método de pago:</label>
            <el-select v-model="metodo_pago" :disabled="props.recibo.pagado || !editable" size="large" style="width: 150px">
              <el-option label="Ninguno" value="ninguno" />
              <el-option label="Efectivo" value="efectivo" />
              <el-option label="Tarjeta" value="tarjeta" />
            </el-select>
            <label>Total:</label>
            <el-input v-model="props.recibo.total" style="width: 100px" :readonly="true" />
          </div>
          <el-button type="primary" @click="pagar" v-if="editable==true&&metodo_pago!='ninguno'&&!props.recibo.pagado">Pagar</el-button>
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
            editable:{
                type: Boolean,
                required:true
            }
        })
    const emit = defineEmits(['pagado']);    
    const config = useRuntimeConfig();
    const userStore = useUserStore();
    const metodo_pago=ref(props.recibo.metodo_pago)
    const editable=ref(props.editable)
    async function pagar(){
      try {
        const response = await $fetch(`${config.public.apiBase}/recibo/${props.recibo.id}/pagar`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${userStore.token}`, // Añadir el token Bearer en los headers
          },
          body: {
            metodo_pago:metodo_pago.value,
          },
        });
        if (response) {
          ElNotification({
            title: 'Exito',
            message: 'Recibo pagado',
            type: 'success',
          })
          emit('pagado',metodo_pago.value)
          editable.value=false
        }
      } catch (error) {
          ElNotification({
            title: 'Error',
            message: 'Error al pagar el recibo',
            type: 'error',
          })
      }
    }
</script>