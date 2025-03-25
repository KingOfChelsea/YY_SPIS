/*
 * @Description:查询客户获取客户信息数据
 * @Author: Zane Xu
 * @Date: 2025-03-13 15:23:21
 * @LastEditTime: 2025-03-17 17:55:41
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

/**查询客户获取客户信息数据 Created By Zane Xu 2025-3-12 */
export const SearchCustomersAPI = (form) => {
  return httpInstance.post(`/customers/get-criteria`,form);
};

