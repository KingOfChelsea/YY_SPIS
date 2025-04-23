/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-04-09 21:32:27
 * @LastEditTime: 2025-04-09 21:32:45
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const registerUserAPI = (form) => {
  return httpInstance.post(`/users/register`, form);
};
