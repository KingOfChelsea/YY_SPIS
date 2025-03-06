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
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutSideBar from './components/LayoutSideBar.vue';


</script>

<style>
.header{
  height: 60px;
  width: 100%;
  /* background-color: aqua; */
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
