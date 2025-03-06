import httpInstance from "@/utils/http";

export const searchPurchaseRecords =(form)=>{
  return httpInstance.post(`/purchaseorders/query`,form)
}
