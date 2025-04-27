/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-04-23 17:50:00
 * @LastEditTime: 2025-04-23 17:51:39
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/OzonHttp";

export const QueryAttribute = (CategoryId,TypeId) => {
  return httpInstance.post(`/v1/description-category/attribute`, {
    "description_category_id":CategoryId,
    "language":"ZH_HANS",
    "type_id":TypeId
  });
};
