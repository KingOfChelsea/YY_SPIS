/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-25 11:35:07
 * @LastEditTime: 2025-03-25 11:44:40
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const updateOrderStatusAPI  = (OrderID,Status) => {
  return httpInstance.put(`salesorders/${OrderID}/status?status=${Status}`);
};
