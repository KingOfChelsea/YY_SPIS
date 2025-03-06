<template>
  <el-tabs v-model="activeName" class="demo-tabs" >
    <el-tab-pane label="📦物料分配" name="first">
      <Insert :products_info="info"></Insert>
    </el-tab-pane>
    <el-tab-pane label="📊批量插入" name="second">
      <Executemany></Executemany>
    </el-tab-pane>
    <el-tab-pane label="🔎分配详情" name="third"><Details></Details></el-tab-pane>
    <el-tab-pane label="📑日志操作" name="fourth">日志操作</el-tab-pane>
  </el-tabs>
</template>

<script setup >
import Insert from './components/Insert.vue';
import Executemany from './components/Executemany.vue';
import Details from "./components/Details.vue"
import { onMounted, ref } from 'vue'
import {getProductsInfoAPI} from "@/apis/warehouse/getProducts_info"

const info = ref(null);
onMounted(async()=>{
  const res = await getProductsInfoAPI()
  info.value = res
})

const activeName = ref('first')


</script>

<style>

</style>
