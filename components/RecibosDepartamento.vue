<template>
    <div>
        <el-button type="warning" @click="recibosList">Recibos</el-button>
        <el-dialog
        v-model="open"
        :title="`Recibos del departamento ${props.departamento.departamento}  Saldo pendiente: ${saldo_pendiente} BS`"
        :append-to-body="true"
        >
            <el-empty description="Sin recibos" v-if="recibos.length<=0" />
            <el-table :data="recibos" height="300" v-if="recibos.length>0" table-layout="auto">
                <el-table-column prop="recibo" label="N° de recibo"  />
                <el-table-column prop="nombre" label="Nombre"  />
                <el-table-column label="Fecha" >
                    <template #default="scope">
                        <span>{{ scope.row.fecha_recibo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="Total"  />
                <el-table-column prop="saldo" label="Saldo"  />
                <el-table-column label="Pagado" >
                    <template #default="scope">
                        <el-tag  :type="scope.row.pagado==true?'success':'danger'" >{{ scope.row.pagado?'Si':'No' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Detalle" >
                    <template #default="scope">
                        <ReciboDetalle :recibo="scope.row"></ReciboDetalle>
                    </template>
                </el-table-column>
                <el-table-column label="Pagar" >
                    <template #default="scope">
                        <ReciboPagar :recibo="scope.row" @pagado="actualizarSaldo(scope.row, $event)" ></ReciboPagar>
                    </template>
                </el-table-column>
                <el-table-column label="Eliminar" >
                    <template #default="scope">
                        <ReciboDelete :recibo="scope.row" @eliminado="eliminado(scope.row, $event)"></ReciboDelete>
                    </template>
                </el-table-column>
                <el-table-column label="Editar" >
                    <template #default="scope">
                        <ReciboEdit  :recibo="scope.row" @actualizar="actualizar(scope.row, $event)" v-if="scope.row.recibo==0"></ReciboEdit>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script setup >
    const props = defineProps({
        departamento: {
        type: Object,
        required: true,
        },
    })
    const userStore = useUserStore();
    const config = useRuntimeConfig();
    const recibos = ref([])
    const open=ref(false)
    const saldo_pendiente=ref(0)
    async function recibosList() {
        open.value=true
        try {
        const response = await $fetch(`${config.public.apiBase}/departamento/${props.departamento.id}/recibos`, {
            headers: {
            Authorization: `Bearer ${userStore.token}`, 
            },
        });

        recibos.value = response.recibos
        saldo_pendiente.value= response.saldo
        } catch (err) {
        console.error('Error inesperado:', err); 
        }
    }
    const actualizarSaldo = (recibo, monto) => {
        recibo.saldo  -= monto ;
        saldo_pendiente.value -= monto
            if(recibo.saldo==0){
                recibo.pagado=true
            } 
    };
    const actualizar = (recibo, new_recibo) => {
        recibo.nombre=new_recibo.nombre
        recibo.saldo=new_recibo.saldo
        recibo.pagado=new_recibo.pagado
        recibo.recibo=new_recibo.recibo
        recibo.fecha_recibo=new_recibo.fecha_recibo
        if(new_recibo.saldo==0){saldo_pendiente.value -=new_recibo.total}
    };

    const eliminado= (recibo, monto) => {
        saldo_pendiente.value -= monto
        
        const index = recibos.value.findIndex(r => r.id === recibo.id);
        if (index !== -1) {
            recibos.value.splice(index, 1);
        }
    };
</script>