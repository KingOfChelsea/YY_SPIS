import httpInstance from "@/utils/http";

export const distributeProductsAPI = (form) => {
  return httpInstance.post(`/warehouse/distribute`,form);
};
