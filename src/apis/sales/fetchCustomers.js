/*
 * @Description:获取全部客户信息
 * @Author: Zane Xu
 * @Date: 2025-03-11 16:02:01
 * @LastEditTime: 2025-03-11 16:02:10
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const fetchCustomersAPI = () => {
  return httpInstance.get(`/customers/get-customers`);
};

