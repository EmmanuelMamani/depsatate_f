<template>
    <div>
        <el-button type="warning" @click="detallesList">Detalle</el-button>
        <el-dialog
        v-model="open"
        title="Detalle del recibo"
        :append-to-body="true"
        >
            <Recibo :recibo="props.recibo" :detalles="detalles"></Recibo>
        </el-dialog>
    </div>
</template>
<script setup >
    const props = defineProps({
        recibo: {
        type: Object,
        required: true,
        },
    })
    const userStore = useUserStore();
    const config = useRuntimeConfig();
    const detalles = ref([])
    const open=ref(false)

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