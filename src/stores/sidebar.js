/*
 * @Description: 
 * @Author: Zane Xu
 * @Date: 2024-12-16 10:59:43
 * @LastEditTime: 2025-03-17 11:48:26
 * @LastEditors: Zane Xu
 */
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
    console.log(res);
    
  };
return {
  SideBarList,
  getSideBar
}
})
