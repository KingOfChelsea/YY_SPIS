/*
 * @Description: 
 * @Author: Zane Xu
 * @Date: 2025-03-26 14:55:37
 * @LastEditTime: 2025-04-23 15:27:39
 * @LastEditors: Zane Xu
 */
import { ref, computed} from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  // 确保 userInfo 默认是对象，防止 JSON.parse 解析 `null`
  // const userInfo = ref(JSON.parse(localStorage.getItem("userData")) || {});
  const userInfo = computed(() => JSON.parse(localStorage.getItem("userData")))

  // 设置用户信息（可用于登录时存储用户数据）
  const setUserInfo = (data) => {
    userInfo.value = data || {};
    localStorage.setItem("userData", JSON.stringify(userInfo.value));
  };

  // 清除用户信息（确保 userInfo 不变成 null）
  const clearUserInfo = () => {
    userInfo.value = {}; // 避免 null.username 报错
    localStorage.removeItem("userData");
    localStorage.removeItem("Token");
  };

  return {
    userInfo,
    setUserInfo,
    clearUserInfo,
  };
});
