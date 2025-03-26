/*
 * @Description:调拨记录审核分配API
 * @Author: Zane Xu
 * @Date: 2025-03-26 11:08:25
 * @LastEditTime: 2025-03-26 14:52:30
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const commitTransferLogAPI = (form) => {
  return httpInstance.post(`/warehouse/inventory-transfer`,form);
};
