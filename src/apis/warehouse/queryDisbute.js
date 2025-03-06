import httpInstance from "@/utils/http";

export const queryDisbuteAPI = (form) => {
  return httpInstance.post(`/warehouse/inventory-statistics`,form);
};
