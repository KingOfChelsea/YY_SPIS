<template>
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <!-- Logo -->
    <el-menu-item index="0">
      <img class="logo" src="https://raw.githubusercontent.com/KingOfChelsea/WorkPicGo/main/202503262052852.jpeg"
        alt="Element logo" />
    </el-menu-item>
    <el-text>横幅位置</el-text>
    <!-- 消息通知 -->
    <el-menu-item index="1" @click="drawer = true">📩 消息通知</el-menu-item>

    <!-- 设置菜单 -->
    <el-sub-menu index="2">
      <template #title>⚙️ 设置</template>
      <el-menu-item index="2-1">🔹 选项 1</el-menu-item>
      <el-menu-item index="2-2">🔹 选项 2</el-menu-item>
      <el-menu-item index="2-3">🔹 选项 3</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>📌 更多选项</template>
        <el-menu-item index="2-4-1">📝 选项 A</el-menu-item>
        <el-menu-item index="2-4-2">📝 选项 B</el-menu-item>
        <el-menu-item index="2-4-3">📝 选项 C</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>

    <!-- 用户菜单（仅在 userInfo 存在时显示） -->
    <el-sub-menu v-if="userInfo" index="3">
      <template #title>
        <span class="user-info">
          🔐 <strong>{{ userInfo.EmployeeName }}</strong>
        </span>
      </template>
      <!-- <el-text type="success"  style="text-align: center;font-size: 26px;">操作</el-text> -->
      <el-divider></el-divider>
      <el-menu-item index="3-1" @click="btnLogout">
        🚪 退出登录
      </el-menu-item>
    </el-sub-menu>
  </el-menu>

  <!-- 侧边栏 -->
  <el-drawer v-model="drawer" title="消息通知" :size="'50%'" direction="rtl" :close-on-click-modal="false"
    :before-close="beforeClose">
    <div class="message-list">
      <!-- 假设的消息内容 -->
      <el-card v-for="(message, index) in messages" :key="index" class="message-item" shadow="hover">
        <h3>{{ message.title }}</h3>
        <p>{{ message.content }}</p>
        <small>{{ message.date }}</small>
      </el-card>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useUserStore } from "@/stores/Roles/roles";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { showNotification } from "@/utils/Ealert";

const userStore = useUserStore();
const router = useRouter();
const userInfo = ref({}); // 初始为空对象，避免 null.username 报错
const drawer = ref(false);
// onMounted(() => {
//   console.log(userInfo.value, userStore.userInfo, "onmounted");
// })

// 监听 Pinia 状态变化，确保 userInfo 数据更新 先监听
watch(
  () => userStore.userInfo,
  (newUserInfo) => {
    // console.log(newUserInfo, "newUserInfo");
    userInfo.value = newUserInfo;
  },
  { immediate: true }
);

// 退出登录逻辑
const btnLogout = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore.clearUserInfo();
      localStorage.removeItem("token");
      router.push("/login");
    })
    .catch((error) => {
      showNotification("error", error);
    });
};

const messages = [
  {
    title: "系统更新通知",
    content: "您的账户已成功更新到最新版本，享受更多新功能。",
    date: "2025-03-26 14:00"
  },
  {
    title: "活动通知",
    content: "我们正在进行春季大促销活动，快来抢购吧！",
    date: "2025-03-25 09:00"
  },
  {
    title: "安全提醒",
    content: "您的账户存在安全风险，请立即更改密码。",
    date: "2025-03-24 11:00"
  }
];

// 打开侧边栏
const openSidebar = () => {
  // console.log(drawerVisible.value);
  drawerVisible.value = true;
};

// 关闭前的钩子函数
const beforeClose = (done) => {
  done(); // 关闭侧边栏时回调
};
</script>

<style scoped>
/* 菜单样式美化 */
.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}

/* Logo 样式 */
.logo {
  width: 70px;
  height: auto;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

/* 退出按钮 hover 效果 */
.el-menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  transition: 0.3s ease;
}
.message-list {
  max-height: 400px;
  overflow-y: auto;
}

.message-item {
  margin-bottom: 20px;
}

.message-item h3 {
  font-size: 18px;
  margin: 0;
}

.message-item p {
  font-size: 14px;
  color: #555;
}

.message-item small {
  color: #888;
  font-size: 12px;
}
</style>
