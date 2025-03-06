import httpInstance from "@/utils/http";

export const insertProductAPI = (form) => {
  return httpInstance.post(`/products/add`, form);
};
