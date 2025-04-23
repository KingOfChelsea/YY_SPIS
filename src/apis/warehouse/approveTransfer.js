/*
 * @Description: 
 * @Author: Zane Xu
 * @Date: 2025-03-27 16:12:33
 * @LastEditTime: 2025-03-27 16:12:44
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const approveTransferLogAPI = (ApproveTransferRequest) => {
  return httpInstance.post(`/warehouse/approve-transfer`,ApproveTransferRequest);
};
