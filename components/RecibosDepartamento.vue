<template>
    <div>
        <el-button type="warning" @click="recibosList">Recibos</el-button>
        <el-dialog
        v-model="open"
        :title="`Recibos del departamento ${props.departamento.departamento}`"
        :append-to-body="true"
        >
            <el-empty description="Sin recibos" v-if="recibos.length<=0" />
            <el-table :data="recibos" height="300" v-if="recibos.length>0" table-layout="auto">
                <el-table-column prop="recibo" label="N° de recibo"  />
                <el-table-column prop="nombre" label="Nombre"  />
                <el-table-column label="Fecha" >
                    <template #default="scope">
                        <span>{{ new Date(scope.row.created_at).toLocaleDateString('es-ES', {day: '2-digit',month: '2-digit',year: 'numeric',})  }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="Total"  />
                <el-table-column label="Metodo de pago" >
                    <template #default="scope">
                        <el-tag  :type="scope.row.metodo_pago!='ninguno'?'success':'danger'" effect="dark">{{ scope.row.metodo_pago }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Detalle" >
                    <template #default="scope">
                        <ReciboDetalle :recibo="scope.row" ></ReciboDetalle>
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
    async function recibosList() {
        open.value=true
        try {
        const response = await $fetch(`${config.public.apiBase}/departamento/${props.departamento.id}/recibos`, {
            headers: {
            Authorization: `Bearer ${userStore.token}`, 
            },
        });

        recibos.value = response.recibos
        } catch (err) {
        console.error('Error inesperado:', err); 
        }
    }
</script>