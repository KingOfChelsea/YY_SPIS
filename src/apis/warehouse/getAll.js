import httpInstance from "@/utils/http";

/**
 * 获取全部厂库信息
 * @returns
 */

export const getWarehouseAPI = () => {
  return httpInstance.get(`/warehouses/getAll`);
};
