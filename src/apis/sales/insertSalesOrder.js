
import httpInstance from "@/utils/http";

export const insertSalesOrderAPI = (form) => {
  return httpInstance.post(`/salesorders`,form);
};
