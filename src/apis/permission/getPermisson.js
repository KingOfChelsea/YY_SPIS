/*
 * @Description:权限数据获取
 * @Author: Zane Xu
 * @Date: 2025-03-14 10:50:09
 * @LastEditTime: 2025-03-14 17:49:20
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const getPermissionAPI = () => {
  return httpInstance.get(`/permissions/getall-permissions`);
};
// /** 获取接口数据 Created By Zane Xu 2025-03-14 */
// onMounted(async ()=>{
//   try {
//     const res = await getRoleDataAPI()
//     const permission_res =await getPermissionAPI()
//     roles.value=res.data
//     permissions.value = permission_res.data
//   } catch (error) {
//     showNotification("error",error)
//   }
// })
