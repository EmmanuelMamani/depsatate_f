<template>
    <div>
        <div class="flex space-x-3">
            <el-input v-model.number="buscado" style="width: 200px" type="number" placeholder="Buscar Recibo" />
            <el-button type="primary" @click="buscar">Buscar</el-button>
        </div>
        <el-dialog v-model="open" title="Detalle del recibo" :append-to-body="true">
            <Recibo v-if="recibo" :recibo="recibo" :detalles="detalles"></Recibo>
            <span v-if="!recibo" class="text-center block">No se encontro el recibo</span>
        </el-dialog>
    </div>
</template>
<script setup>
    const buscado=ref('')
    const open = ref(false)
    const recibo=ref(null)
    const detalles = ref(null)

    const userStore = useUserStore();
    const config = useRuntimeConfig();

    async function buscar(){
        open.value=true
        try {
        const response = await $fetch(`${config.public.apiBase}/recibo/${buscado.value}`, {
            headers: {
            Authorization: `Bearer ${userStore.token}`, 
            },
        });
        detalles.value = response.detalles
        recibo.value=response.recibo
        } catch (err) {
            recibo.value=''
            detalles.value=''
        }
    }
</script>