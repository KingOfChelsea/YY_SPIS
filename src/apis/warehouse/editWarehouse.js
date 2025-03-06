import httpInstance from "@/utils/http";

export const updateWarehouseAPI = (ID,form) => {
  return httpInstance.put(`/warehouse/update/${ID}`,form);
};
