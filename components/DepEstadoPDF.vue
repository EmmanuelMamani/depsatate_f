<template>
    <el-button @click="pdfGenerate" :type="props.tipo">Dep. {{ props.estado }}</el-button>
</template>
<script setup>
  import { jsPDF } from 'jspdf';
  import 'jspdf-autotable';

    const props = defineProps({
        departamentos: {type: Array,required: true},
        bloque:{type:String,required:true},
        estado:{type:String , required:true},
        tipo:{type:String,required:true}
    })

    async function pdfGenerate() {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        const text = `Bloque ${props.bloque} departamentos ${props.estado}s`;
        const textWidth = doc.getTextWidth(text);
        const textX = (pageWidth - textWidth) / 2;
        doc.text(text, textX, 10);
        
        const rows = props.departamentos
                    .filter(item => item.estado.toLowerCase() === `${props.estado}`) 
                    .map(item => [item.departamento,item.estado]);

        const headers = [['Departamento', 'Estado']];

        doc.autoTable({head: headers,body: rows,startY: 20,});

        doc.save(`bloque_${props.bloque}.pdf`);
    }
</script>