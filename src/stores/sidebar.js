import { ref } from 'vue'
import { defineStore } from 'pinia'
import {getSideBarAPI} from "@/apis/getSideBar"

export const useSideBarStore = defineStore('sidebar', () => {
  // 导航列表的数据管理

  // state 导航列表数据
  const SideBarList = ref([])

  // action 获取导航数据的方式
  const getSideBar = async () => {
    const res = await getSideBarAPI(1); // 注意这里将 1 转换为字符串 '1'
    SideBarList.value = res;
  };
return {
  SideBarList,
  getSideBar
}
})
