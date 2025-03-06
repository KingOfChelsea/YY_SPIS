<template>
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <el-menu-item index="0">
      <img style="width: 100px"
        src="https://raw.githubusercontent.com/KingOfChelsea/MarkdownPicGo/main/202501241619526.png"
        alt="Element logo" />
    </el-menu-item>
    <el-menu-item index="1"> 消息通知 </el-menu-item>
    <el-sub-menu index="2">
      <template #title>设置</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3">
      <!-- {{ weather.data }} -->
    </el-menu-item>
  </el-menu>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getWeather } from '@/apis/weather/getLocalWeather';
const weather = ref(null);
onMounted(async () => {
  try {
    const res = await getWeather()
    weather.value = res.data
    console.log(weather.data.type,123);
  } catch (error) {
      console.log(error);
  }
})
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
