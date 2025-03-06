<template>
  <el-menu default-active="2" class="el-menu-vertical-demo">
    <div v-for="(Fitem, Findex) in SideBarStore.SideBarList" :key="Findex">
      <div>
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>{{ Fitem.PermissionName }}</span>
          </template>
          <div>
            <el-menu-item-group :key="Findex + 1" :title="Fitem.PermissionName">
              <div v-for="(item, index) in Fitem.SubMenus" :key="index">
                <el-menu-item :index="`1-${index}`" @click="goToPage(item)">
                  {{ item.PermissionName }}
                </el-menu-item>
              </div>
            </el-menu-item-group>
          </div>
        </el-sub-menu>
      </div>
    </div>
  </el-menu>
</template>

<script setup lang="ts">
import { useSideBarStore } from "@/stores/sidebar";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const SideBarStore = useSideBarStore();

onMounted(async () => {
  SideBarStore.getSideBar();
});

// 菜单项点击事件处理函数
const goToPage = (item) => {
  if (item.Path) {
    router.push(`${item.Path}`); // 跳转到目标路由
  }
};
</script>

<style lang="scss"></style>
