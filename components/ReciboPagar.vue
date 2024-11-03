<template>
    <div>
        <el-button type="success" @click="open=true">Pagar</el-button>
        <el-dialog
        v-model="open"
        title="Pagar recibo"
        :append-to-body="true"
        >
            <label for="" class="text-slate-800 text-lg block mb-4">Saldo pendiente {{ props.recibo.saldo }} Bs.</label>
            <label for="">Monto a pagar </label>
            <el-input v-model.number="total" style="width: 100px" type="number" step="0.01" placeholder="Total"  :min="1" :max="props.recibo.saldo" />
            <label>Método de pago:</label>
            <el-select v-model="metodo_pago" placeholder="Método de pago" size="large" style="width: 150px">
                <el-option label="Efectivo" value="efectivo" />
                <el-option label="Tarjeta" value="tarjeta" />
            </el-select>
            <el-button type="primary" @click="pagar_recibo">Registrar recibo</el-button>
          <el-alert :title="error_pago" v-if="error_pago!=''" type="error" :closable="false" />
        </el-dialog>
    </div>
</template>
<script setup>
    const open=ref(false)
    const config = useRuntimeConfig();
    const userStore = useUserStore();
    const props = defineProps({
        recibo: {
        type: Object,
        required: true,
        },
    })
    const total=ref(0)
    const metodo_pago=ref('efectivo')
    const error_pago=ref('')
    const emit = defineEmits(['pagado'])
    async function pagar_recibo(){
        if(total.value>props.recibo.saldo || total.value<=0){error_pago.value=`El total a pagar debe estar entre 1 y ${props.recibo.saldo}`; return;}else{error_pago.value=''; }
        try {
            const response = await $fetch(`${config.public.apiBase}/recibo/${props.recibo.id}/pagar`, {
                method: 'patch',
                headers: {
                Authorization: `Bearer ${userStore.token}`, // Añadir el token Bearer en los headers
                },
                body: {
                metodo_pago:metodo_pago.value,
                total:total.value,
                },
            });
            if (response) {
                ElNotification({
                title: 'Exito',
                message: 'Pago realizado exitosamente',
                type: 'success',
                })
                emit('pagado', total.value)
                open.value=false
                total.value=0
            }
            } catch (error) {
                ElNotification({
                title: 'Error',
                message: 'Error al pagar',
                type: 'error',
                })
            }
    }
</script>