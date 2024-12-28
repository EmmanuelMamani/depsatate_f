<template>
    <div class="rounded shadow p-2">
        <span class="text-center block my-2 text-sky-900 text-lg" >{{ props.detalle }}</span>
        <div class="flex justify-center items-center space-x-3">
            <Icon :name="props.icon" class="text-sky-900 !inline w-10 h-10" />
            <span class="col-span-2 font-semibold text-xl block text-center">{{ props.monto }} Bs</span>
        </div>
        <div v-if="props.efectivo>0" class="flex justify-center items-center space-x-3 my-1">
            <Icon name="material-symbols:attach-money" class="text-yellow-500 !inline w-5 h-5" />
            <span class=" block text-center">{{ props.efectivo }} Bs</span>
        </div>
        <div v-if="props.tarjeta>0" class="flex justify-center items-center space-x-3 my-1">
            <Icon name="material-symbols:credit-card" class="text-green-500 !inline w-5 h-5" />
            <span class=" block text-center">{{ props.tarjeta }} Bs</span>
        </div>
    </div>
</template>
<script setup>
    const props = defineProps({
        detalle:{type:String,required:true},
        icon:{type:String,required:true},
        monto:{type:Number,required:true,default: 0},
        efectivo:{type:Number,required:true,default: 0},
        tarjeta:{type:Number,required:true,default: 0}
    })
</script>