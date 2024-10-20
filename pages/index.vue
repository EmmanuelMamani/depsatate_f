<template>
    <div class="bg-slate-300 flex justify-center items-center h-screen">
        <div class="bg-white rounded p-5 w-1/3 mx-auto my-auto">
            <h3 class="text-center text-2xl">Iniciar Sesión</h3>
            <label class="block">Email:</label>
            <el-input v-model="email" class="w-full mt-2 mb-2" placeholder="Ingrese su email" />
            <label class="block">Password:</label>
            <el-input v-model="password" class="w-full mt-2 mb-4" placeholder="Ingrese su password" type="password" show-password />
            <div class="flex justify-center">
                <el-button @click="login_f" type="primary" :loading="loading">Ingresar</el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
const config = useRuntimeConfig();
const email = ref('')
const password = ref('')
const loading= ref(false)
async function login_f() {
  loading.value=true
  try {
    const token = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });
    if (token) {
      const user = await $fetch(`${config.public.apiBase}/auth/me`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access_token}`, // Añadir el token Bearer en los headers
        },
        body: {
        },
        
      });
      if(user){
        const userStore = useUserStore();
        userStore.setUser(user, token.access_token);
        navigateTo('/dashboard');
      }
    }
  } catch (error) {
      ElNotification({
        title: 'Error',
        message: 'Credenciales incorrectas',
        type: 'error',
      })
  }
  loading.value=false
}
definePageMeta({
  layout: 'empty'
});
</script>