/*
 * @Description: 
 * @Author: Zane Xu
 * @Date: 2024-12-16 10:59:43
 * @LastEditTime: 2025-04-23 15:31:50
 * @LastEditors: Zane Xu
 */
/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2024-12-16 10:59:43
 * @LastEditTime: 2025-03-26 21:15:59
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
    const userInfo = ref(JSON.parse(localStorage.getItem("userData")) || null);
    // console.log(userInfo._rawValue.roleID);
    const res = await getSideBarAPI(userInfo._rawValue.RoleID);
    SideBarList.value = res;
  };
return {
  SideBarList,
  getSideBar
}
})
