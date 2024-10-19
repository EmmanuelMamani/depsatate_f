<template>
    <div class="bg-slate-700" v-if="userStore.user">
        <el-menu
        active-text-color="#ffd04b"
        background-color="#334155"
        class="el-menu-vertical-demo"
        :default-active="activeIndex"
        text-color="#fff"
      >
        <el-menu-item index="1">
          <span>Navigator Four</span>
        </el-menu-item>
      </el-menu>
    </div>
</template>
<script setup>
const activeIndex = ref('1')
const userStore = useUserStore();
</script>