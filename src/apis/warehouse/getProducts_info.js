import httpInstance from "@/utils/http";

/**
 * 入库分配所需信息
 * @returns
 */
export const getProductsInfoAPI = () => {
  return httpInstance.get(`/warehouse/products-info`);
};
