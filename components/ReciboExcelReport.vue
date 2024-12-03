<template>
    <el-button @click="exportToExcel" type="success">Excel</el-button>
</template>
<script setup>

    const props = defineProps({
        recibos: {type: Array,required: true},
    })

    import * as XLSX from 'xlsx';


    async function exportToExcel(){

      // Convertir el array a una hoja de trabajo (worksheet)
      const data = props.recibos.map(({ departamento,estado_dep,total,saldo,pagado,recibo,fecha_recibo,mes_correspondiente,estado }) => ({ departamento,estado_dep,total,saldo,pagado,recibo,fecha_recibo,mes_correspondiente,estado }));
      const worksheet = XLSX.utils.json_to_sheet(data);
    
      // Crear un libro de trabajo (workbook)
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Generar el archivo Excel y descargarlo
      XLSX.writeFile(workbook, 'recibos.xlsx');
    }

</script>