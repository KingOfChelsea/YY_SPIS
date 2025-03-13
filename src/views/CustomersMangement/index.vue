<!--
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-11 15:43:01
 * @LastEditTime: 2025-03-11 17:28:35
 * @LastEditors: Zane Xu
-->
<template>
  <el-container>
    <el-header>
      <h2 class="title">📋 客户管理</h2>
    </el-header>

    <el-main>
      <!-- Tabs 标签页 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="📰客户信息" name="buyers">
          <CustomerData></CustomerData>
        </el-tab-pane>
        <el-tab-pane label="📝创建客户" name="CreateBuyer">
          <CreateCustomers></CreateCustomers>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref} from "vue";
import CustomerData from "./components/CustomerData.vue";
import CreateCustomers from "./components/CreateCustomers.vue";

// **选中的 Tab**
const activeTab = ref("buyers");


</script>

<style scoped>
.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}


</style>
