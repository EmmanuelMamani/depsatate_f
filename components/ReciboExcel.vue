<template>
    <div>
        <el-button type="success" @click="open = true">Importar Excel</el-button>
        <el-dialog v-model="open" title="Importar Excel de Recibos" :append-to-body="true">
            <div class="flex space-x-2 items-center mt-2">
                <label>Correspondiente al mes:</label>
                <el-date-picker v-model="mes" type="month" placeholder="Elige un mes" />
            </div>
            <el-alert :title="error_mes" v-if="error_mes" type="error" :closable="false" />

            <div class="flex space-x-2 items-center mt-2">
                <el-upload  :auto-upload="false" accept=".xlsx" :limit="1" :on-change="handleFileChange">
                    <template #trigger>
                        <div class="flex space-x-3 items-center">
                            <span>Solo se admiten archivos .xlsx</span>
                            <el-button type="success">Elegir Excel</el-button>
                        </div>
                    </template>
                </el-upload>
            </div>
            <el-alert :title="error_file" v-if="error_file" type="error" :closable="false" />

            <div class="flex justify-center mt-4">
                <el-button type="primary" @click="importar">Importar Recibos</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import * as XLSX from "xlsx";

const config = useRuntimeConfig();
const userStore = useUserStore();

const props = defineProps({ bloque: {type: Number,required: true } })
const open = ref(false);
const mes = ref("");
const archivo = ref(null)
const error_mes = ref("");
const error_file = ref("");

const handleFileChange = (file, fileList) => {
  archivo.value = file.raw
}

async function importar() {
    if (mes.value === "") {error_mes.value = "Elige un mes"; return;} else {error_mes.value = ""; }

    if (!archivo.value) { error_file.value = "Elige un archivo"; return;} else {error_file.value = ""; }

    const file = archivo.value;
    const reader = new FileReader();

    reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Leer la primera hoja del archivo
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertir los datos de la hoja en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const recibos = procesarDatos(jsonData)
        enviarDatos(recibos)

    };

    reader.onerror = () => {
        error_file.value = "Error al leer el archivo";
    };

    reader.readAsArrayBuffer(file);
}
function procesarDatos(datos) {
    if (datos.length < 2) {error_file.value = "Error al leer el archivo"; return [];}

    const headers = datos[0];

    const registros = datos.slice(1).map((fila) => {
        const registro = {};
        headers.forEach((clave, index) => {
            registro[clave] = fila[index] || 0;
        });
        return registro;
    });
    return registros
}

async function enviarDatos(data) {
    const fecha=new Date(mes.value)
    open.value=false
    try {
    const response = await $fetch(`${config.public.apiBase}/recibo/create_recibos`, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${userStore.token}`, // Añadir el token Bearer en los headers
        },
        body: {
            recibos:data,
            mes:`${fecha.getFullYear()}-${(fecha.getMonth()+1).toString().padStart(2, '0')}`,
            bloque:props.bloque,
            user_id:userStore.user.id
        },
    });
    if (response) {       
        ElNotification({
        title: 'Exito',
        message: 'Recibos creados exitosamente',
        type: 'success',
        })
        mes.value=''
        archivo.value=null
    }
    } catch (error) {   
        ElNotification({
        title: 'Error',
        message: `No se pudo registrar los recibos`,
        type: 'error',
        })
    }
}
</script>
