import httpInstance from "@/utils/http";

/**
 *
 * @param {*number} Id 仓库ID
 * @returns
 */
export const deleteWarehouseAPI = (Id) => {
  return httpInstance.delete(`/warehouse/delete/${Id}`);
};
