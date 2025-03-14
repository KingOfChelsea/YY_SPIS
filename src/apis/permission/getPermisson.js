/*
 * @Description:权限数据获取
 * @Author: Zane Xu
 * @Date: 2025-03-14 10:50:09
 * @LastEditTime: 2025-03-14 10:50:51
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const getPermissionAPI = () => {
  return httpInstance.get(`/permissions/getall-permissions`);
};
