<template>
    <div class="rounded shadow p-2">
        <span class="text-center block my-2 text-sky-900 text-lg" >{{ props.detalle }}</span>
        <div class="flex justify-center items-center space-x-3">
            <Icon :name="props.icon" class="text-sky-900 !inline w-10 h-10" />
            <span class="col-span-2 font-semibold text-xl block text-center">{{ props.monto }} Bs</span>
        </div>
    </div>
</template>
<script setup>
    const props = defineProps({
        detalle:{type:String,required:true},
        icon:{type:String,required:true},
        monto:{type:Number,required:true,default: 0}
    })
</script>