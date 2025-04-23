<!--
 * @Description:
 * @Author: Zane Xu
 * @Date: 2024-12-15 11:53:47
 * @LastEditTime: 2025-03-27 15:53:46
 * @LastEditors: Zane Xu
-->
<template>

  <header class="header">
    <LayoutHeader></LayoutHeader>
  </header>
  <div class="container">
    <div class="left">
      <LayoutSideBar></LayoutSideBar>
    </div>
    <div class="main">
          <!-- 二级路由 -->
     <RouterView></RouterView>
    </div>

  </div>

</template>

<script setup lang='ts'>
import { useUserStore } from '@/stores/Roles/roles';
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutSideBar from './components/LayoutSideBar.vue';

const userStore = useUserStore();

</script>

<style>
.header{
  height: 60px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.container{
  width: 100%;
  height:100%;
  /* background-color: blue; */
  padding-top:60px;
  box-sizing: border-box;
  .left{
    float: left;
    width: 200px;
    background-color: aliceblue;
    height: 100%;
    overflow: auto;
  }
  .main{
    overflow: hidden;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;

  }
}
</style>
