/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-18 15:32:15
 * @LastEditTime: 2025-03-18 15:32:52
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const createPermissionAPI = (form) => {
  return httpInstance.post(`/permissions/create-permission`, form);
};
