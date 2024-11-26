<template>
    <div>
        <el-popconfirm title="Seguro que quieres eliminar?" @confirm="eliminar">
            <template #reference>
                <el-button type="danger">Eliminar</el-button>
            </template>
        </el-popconfirm>
    </div>
</template>
<script setup>
    const props = defineProps({
        recibo: {type: Object, required: true}
    })

    const config = useRuntimeConfig();
    const userStore = useUserStore();

    const emit = defineEmits(['eliminado'])

    async function eliminar(){
        try {
      const response = await $fetch(`${config.public.apiBase}/recibo/${props.recibo.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        }
      });
      if (response) {
            emit('eliminado', props.recibo.saldo)
      }
    } catch (error) {   

    }
    }
</script>