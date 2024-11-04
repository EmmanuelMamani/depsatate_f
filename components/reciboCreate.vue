<template>
    <div>
      <el-button type="primary" @click="existe_recibo_mes">Crear recibo</el-button>
      <el-dialog
        v-model="open"
        :title="`Crear recibo para departamento ${props.departamento.departamento}`"
        :append-to-body="true"
        @close="clear"
      >
        <div class="space-y-3">

          <el-alert v-if="existe" title="Ya creaste un recibo este mes para este departamento" type="warning" :closable="false" />
          
          <div class="flex space-x-2 items-center">
            <label>N° Recibo:</label>
            <el-input v-model="recibo" style="width: 100px" placeholder="Recibo" />
            <label>Nombre:</label>
            <el-input v-model="nombre" style="width: 200px" placeholder="Nombre del recibo" />
            <label>Gestion:</label>
            <el-input v-model.number="gestion" style="width: 100px" type="number"  placeholder="Gestion" />
          </div>
          <el-alert :title="error_recibo" v-if="error_recibo!=''" type="error" :closable="false" />
          
          <h3 class="text-lg text-slate-700 border-b border-slate-700">Detalle del recibo:</h3>
          <div class="flex space-x-2 items-center">
            <label>Nuevo detalle:</label>
            <el-input v-model="new_detalle" style="width: 200px" placeholder="Detalle" />
            <label>Monto:</label>
            <el-input v-model.number="new_monto" style="width: 100px" type="number" step="0.01" placeholder="Monto" />
            <el-button type="primary" @click="agregarDetalle">Agregar</el-button>
          </div>
          <el-alert :title="error_detalle" v-if="error_detalle!=''" type="error" :closable="false" />
  
          <el-table :data="detalles" height="300" v-if="detalles.length > 0" class="w-full">
            <el-table-column prop="detalle" label="Detalle" />
            <el-table-column prop="monto" label="Monto" />
            <el-table-column label="Eliminar">
              <template #default="scope">
                <el-button type="danger" @click="eliminarDetalle(scope.$index)">Eliminar</el-button>
              </template>
            </el-table-column>
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
            <el-input :model-value="totalComputed" style="width: 100px" :readonly="true" />
          </div>
          <el-alert :title="error_total" v-if="error_total!=''" type="error" :closable="false" />
          
          <h3 class="text-lg text-slate-700 border-b border-slate-700">Nota:</h3>
          <el-input v-model="nota" class="w-full block" :rows="2" type="textarea" placeholder="Escribe una nota"/>
          
          <el-button type="primary" @click="registrar_recibo">Registrar recibo</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    departamento: {
      type: Object,
      required: true,
    },
  })
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const open = ref(false)
  const existe = ref(false)
  const recibo = ref('')
  const nombre = ref('')
  const detalles = ref([])
  const nota = ref ('')
  const gestion = ref ('')
  const new_detalle = ref('Expensas de')
  const new_monto = ref(0)
  const metodo_pago = ref('ninguno')
  new_monto.value = props.departamento.expensa || 0
  nombre.value = props.departamento.propietario || ''

  
  //errores alert
  const error_recibo=ref('')
  const error_detalle=ref('')
  const error_total=ref('')


  const totalComputed = computed(() => {
    return detalles.value.reduce((sum, item) => sum + Number(item.monto), 0)
  })
  
  const eliminarDetalle = (index) => {
    detalles.value.splice(index, 1)
  }
  
  const agregarDetalle = () => {
    if (new_detalle.value && new_monto.value) {
      detalles.value.push({
        detalle: new_detalle.value,
        monto: new_monto.value
      })
      new_detalle.value = ''
      new_monto.value = 0
      error_detalle.value=''
    } else {
      error_detalle.value='Complete todos los campos para agregar un detalle'
    }
  }

  function clear(){
    recibo.value = ''
    nombre.value = props.departamento.propietario
    detalles.value = []
    new_detalle.value = 'Expensas de'
    metodo_pago.value = 'ninguno'
    new_monto.value = props.departamento.expensa 
    error_recibo.value=''
    error_detalle.value=''
    error_total.value=''
  }

  async function registrar_recibo(){
    //validar campos
    if(recibo.value==''){error_recibo.value='Complete el N° de recibo'; return; }else{error_recibo.value=''}
    if(nombre.value==''){error_recibo.value='Complete el Nombre en el recibo';return;}else{error_recibo.value=''}
    if(gestion.value==''){error_recibo.value='Complete la gestion del recibo';return;}else{error_recibo.value=''}
    if(totalComputed.value==0){error_total.value='El total no puede ser 0';return;}else{error_total.value=''}

    try {
      const response = await $fetch(`${config.public.apiBase}/recibo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userStore.token}`, // Añadir el token Bearer en los headers
        },
        body: {
          recibo:recibo.value,
          metodo_pago:metodo_pago.value,
          total:totalComputed.value,
          departamento_id:props.departamento.id,
          user_id:userStore.user.id,
          nombre:nombre.value,
          detalles:detalles.value,
          nota:nota.value,
          gestion:gestion.value
        },
      });
      if (response) {
        ElNotification({
          title: 'Exito',
          message: 'Recibo creado exitosamente',
          type: 'success',
        })
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
  async function existe_recibo_mes(){
    open.value=true
    try {
      const response = await $fetch(`${config.public.apiBase}/departamento/${props.departamento.id}/existe_recibo_mes`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userStore.token}`, // Añadir el token Bearer en los headers
        }
      });
      if (response) {
        existe.value=response
      }
    } catch (error) {   

    }
  }
  </script>