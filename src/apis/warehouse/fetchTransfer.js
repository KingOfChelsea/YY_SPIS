import httpInstance from "@/utils/http";

export const fetchTransferAPI = (form) => {
  return httpInstance.post(`/warehouse/query-transfers`,form);
};
