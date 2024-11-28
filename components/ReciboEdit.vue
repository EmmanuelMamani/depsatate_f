<template>
    <div>
      <el-button type="primary" @click="detallesList">Editar recibo</el-button>
      <el-dialog
        v-model="open"
        :title="`Editar recibo`"
        :append-to-body="true">
        <div class="space-y-3">
          
          <div class="flex space-x-2 items-center">
            <label>N° Recibo:</label>
            <el-input v-model.number="recibo" style="width: 100px" type="number" placeholder="Recibo" />
            <label>Nombre:</label>
            <el-input v-model="nombre" style="width: 200px" placeholder="Nombre del recibo" />
            <label>Fecha:</label>
            <el-date-picker v-model="fecha_recibo" type="date" placeholder="Fecha del recibo"  />
          </div>
          <div class="flex space-x-2 items-center mt-2">
            <label>Correspondiente al mes:</label>
            <el-date-picker v-model="props.recibo.mes_correspondiente" type="month" :readonly="true" />
          </div>
          <el-alert :title="error_recibo" v-if="error_recibo!=''" type="error" :closable="false" />
          
          <h3 class="text-lg text-slate-700 border-b border-slate-700">Detalle del recibo:</h3>
          <el-table :data="detalles" height="300" v-if="detalles.length > 0" class="w-full">
            <el-table-column prop="detalle" label="Detalle" />
            <el-table-column prop="monto" label="Monto" />
          </el-table>
  
          <h3 class="text-lg text-slate-700 border-b border-slate-700">Total:</h3>
          <div class="flex space-x-2 items-center">
            <label>Método de pago:</label>
            <el-select v-model="metodo_pago" placeholder="Método de pago" size="large" style="width: 150px">
              <el-option label="Ninguno" value="ninguno" />
              <el-option label="Efectivo" value="efectivo" />
              <el-option label="Tarjeta" value="tarjeta" />
            </el-select>
            <label>Total:</label>
            <el-input v-model="props.recibo.total" style="width: 100px" :readonly="true" />
          </div>
    
          <h3 class="text-lg text-slate-700 border-b border-slate-700">Nota:</h3>
          <el-input v-model="nota" class="w-full block" :rows="2" type="textarea" placeholder="Escribe una nota"/>
          
          <el-button type="primary" @click="editar_recibo">Registrar recibo</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    recibo: {type: Object,required: true,},
  })
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const emit = defineEmits(['actualizar'])

  const open = ref(false)
  const recibo = ref('')
  const nombre = ref('')
  const nota = ref ('')
  const fecha_recibo = ref ('')
  const metodo_pago = ref('ninguno')
  const detalles=ref([])
  nombre.value = props.recibo.nombre || ''

  //errores alert
  const error_recibo=ref('')

  async function editar_recibo(){
    //validar campos
    if(recibo.value==''){error_recibo.value='Complete el N° de recibo'; return; }else{error_recibo.value=''}
    if(nombre.value==''){error_recibo.value='Complete el Nombre en el recibo';return;}else{error_recibo.value=''}
    if(fecha_recibo.value==''){error_recibo.value='Complete la Fecha del recibo';return;}else{error_recibo.value=''}

    try {
      const response = await $fetch(`${config.public.apiBase}/recibo/${props.recibo.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        body: {
          recibo:recibo.value,
          metodo_pago:metodo_pago.value,
          nombre:nombre.value,
          nota:nota.value,
          fecha_recibo:fecha_recibo.value,
          total:props.recibo.total
        },
      });
      if (response) {
        ElNotification({
          title: 'Exito',
          message: 'Recibo actualizado exitosamente',
          type: 'success',
        })
        emit('actualizar',response)
        open.value=false
      }
    } catch (error) {   
        const mensaje=error.response?._data?.error=='El recibo ya existe.'?'El recibo ya existe.':'Error al crear el recibo'
        ElNotification({
          title: 'Error',
          message: `${mensaje}`,
          type: 'error',
        })
    }
  }
  async function detallesList() {
        open.value=true
        try {
        const response = await $fetch(`${config.public.apiBase}/recibo/${props.recibo.id}/detalles`, {
            headers: {
            Authorization: `Bearer ${userStore.token}`, 
            },
        });

        detalles.value = response.detalles
        
        } catch (err) {
        console.error('Error inesperado:', err); 
        }
    }
  </script>