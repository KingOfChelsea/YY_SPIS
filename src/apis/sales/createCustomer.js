/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-11 17:26:45
 * @LastEditTime: 2025-03-11 17:26:58
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const  createCustomerAPI  = (form) => {
  return httpInstance.post(`/customers/create-customer`,form);
};
