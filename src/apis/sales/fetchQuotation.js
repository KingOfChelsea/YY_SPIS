/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-18 10:39:31
 * @LastEditTime: 2025-03-18 11:28:58
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const fetchQuatationAPI = (form) => {
  return httpInstance.post(`/salesorders/search`,form);
};
