<!--
 * @Description:
 * @Author: Zane Xu
 * @Date: 2024-12-15 15:08:25
 * @LastEditTime: 2025-04-22 21:43:19
 * @LastEditors: Zane Xu
-->
<template>
  <el-menu class="el-menu-vertical-demo" :unique-opened="true" :default-openeds="openedMenus">
    <div v-for="(Fitem, Findex) in SideBarStore.SideBarList" :key="Findex">
      <el-sub-menu :index="`${Findex + 1}`" @click="toggleMenu(Findex + 1)">
        <template #title>
            <el-icon><component :is="Fitem.Icon"/></el-icon>
          <span>{{ Fitem.PermissionName }}</span>
        </template>
        <el-menu-item-group :key="Findex + 1" :title="Fitem.PermissionName">
          <el-menu-item v-for="(item, index) in Fitem.SubMenus" :key="index" :index="`${Findex + 1}-${index + 1}`"
            @click="goToPage(item)">
            {{ item.PermissionName }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </div>
  </el-menu>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSideBarStore } from "@/stores/sidebar";

const router = useRouter();
const SideBarStore = useSideBarStore();
const openedMenus = ref([]); // 记录当前展开的菜单项

onMounted(async () => {
  await SideBarStore.getSideBar();
});

// **菜单点击时控制展开**
const toggleMenu = (index) => {
  if (openedMenus.value.includes(index)) {
    openedMenus.value = openedMenus.value.filter(i => i !== index); // 关闭已展开的菜单
  } else {
    openedMenus.value = [index]; // 仅展开当前菜单
  }
};

// **跳转页面**
const goToPage = (item) => {
  if (item.Path) {
    router.push(`${item.Path}`);
  }
};

const resolveIcon = (iconName) => {
  console.log("iconName from DB:", iconName)
  const fixedName = iconName?.charAt(0).toUpperCase() + iconName?.slice(1)
  return Icons[fixedName] || Icons['QuestionFilled']
}

</script>
