<template>
  <el-container>
    <el-header>
      <h2 class="title">QQ 邮箱</h2>
    </el-header>

    <el-main>
      <!-- 嵌入 QQ 邮箱 Web 版本 -->
      <iframe
        src="https://mail.qq.com"
        width="100%"
        height="800px"
        frameborder="0"
        title="QQ邮箱"
      ></iframe>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>
