/*
 * @Description:删除客户接口
 * @Author: Zane Xu
 * @Date: 2025-03-11 17:10:14
 * @LastEditTime: 2025-03-11 17:12:51
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const deleteCustomersAPI = (id) => {
  return httpInstance.post(`/customers/delete-customer?id=${id}`);
};
