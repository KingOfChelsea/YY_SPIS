import httpInstance from "@/utils/http";

export const insertWarehouseAPI = (form) => {
  return httpInstance.post(`/warehouse/create`,form);
};
