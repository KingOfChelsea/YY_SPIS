import httpInstance from "@/utils/http";
export const searchProductData =(form)=>{
  return httpInstance.post(`/products/query`,form)
}
