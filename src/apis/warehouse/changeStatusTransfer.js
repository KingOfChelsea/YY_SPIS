

import httpInstance from "@/utils/http";

export const changeStatusTransferAPI = (ApproveTransferRequest) => {
  return httpInstance.post(`/warehouse/change-status`,ApproveTransferRequest);
};