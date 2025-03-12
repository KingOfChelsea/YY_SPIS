import httpInstance from "@/utils/http";

/**查询客户获取客户信息数据 Created By Zane Xu 2025-3-12 */
export const SearchCustomersAPI = (form) => {
  return httpInstance.post(`/customers/get-criteria`,form);
};
