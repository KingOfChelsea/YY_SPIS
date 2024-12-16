<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>采购流程</span>
      </template>
        <el-menu-item index="1-1">供应商管理</el-menu-item>
        <el-menu-item index="1-2">生成采购单</el-menu-item>
        <el-menu-item index="1-3">采购审批</el-menu-item>
        <el-menu-item index="1-4">验收入库</el-menu-item>
        <el-menu-item index="1-5">采购记录</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><location /></el-icon>
        <span>库存管理</span>
      </template>
        <el-menu-item index="2-1">初始化库存</el-menu-item>
        <el-menu-item index="2-2">库存查询</el-menu-item>
        <el-menu-item index="2-3">库存调拨</el-menu-item>
        <el-menu-item index="2-4">库存盘点</el-menu-item>
    </el-sub-menu>



    <el-sub-menu index="3">
      <template #title>
        <el-icon><location /></el-icon>
        <span>销售管理</span>
      </template>
        <el-menu-item index="3-1">生成报价单</el-menu-item>
        <el-menu-item index="3-2">订单审核节点</el-menu-item>
        <el-menu-item index="3-3">发货管理</el-menu-item>
        <el-menu-item index="3-4">销售记录</el-menu-item>
        <el-menu-item index="3-5">客户管理</el-menu-item>
        <el-menu-item index="3-5">开具发票</el-menu-item>
    </el-sub-menu>





  </el-menu>
</template>

<script setup lang='ts'>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
</script>

<style lang="scss">

</style>
