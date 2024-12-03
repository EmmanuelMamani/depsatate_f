<template>
    <div><el-button type="info" @click="pdfGenerate">PDF</el-button></div>
</template>
<script setup>
    const props = defineProps({
        recibos: {type: Array,required: true},
    })
    import { jsPDF } from 'jspdf';
    import 'jspdf-autotable';
    async function pdfGenerate() {
        const doc = new jsPDF();
        // Agregar datos al PDF
        doc.text(`Reporte de recibos`, 10, 10);
    
        // Formatear datos de la tabla filtrada para jsPDF-autotable
        const rows = props.recibos.map(item => [
        item.departamento,
        item.estado,
        item.recibo,
        item.fecha_recibo,
        item.mes_correspondiente,
        ]);
        const headers = [['Departamento', 'Estado', 'Recibo', 'Fecha', 'Mes correspondiente']];

        doc.autoTable({
        head: headers,
        body: rows,
        startY: 20, 
        });
    
        doc.save(`reporte_recibos.pdf`);     
  }
  
</script>