<template>
    <div>
        <el-menu 
            v-if="userStore.user"
            :ellipsis="false"
            mode="horizontal" 
            background-color="#1e293b" 
            text-color="#fff"
            active-text-color="#ffd04b"
            class="w-full">
            <el-menu-item class="!mr-auto" index="1">Diva</el-menu-item>
            <el-sub-menu index="2">
                <template #title>
                    <Icon name="line-md:account" class="text-white !inline w-5 h-5" />
                </template>
                <el-menu-item index="2-1" @click="logout">logout</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>
<script setup>
const userStore = useUserStore();
async function logout(){
    const user = await $fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        body: {
        },
    });
    if(user){
        userStore.logout()
        navigateTo('/');
    }
}
</script>