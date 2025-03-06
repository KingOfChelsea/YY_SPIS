<template>
  <el-tabs v-model="activeName" class="demo-tabs" >
    <el-tab-pane label="🏭仓库调拨申请" name="first"><Insert></Insert></el-tab-pane>
    <el-tab-pane label="📝调拨记录查询" name="second"><Query></Query></el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Insert from "./components/Insert.vue"
import Query from './components/Query.vue';
const activeName = ref('first')

</script>

<style scoped>
</style>
