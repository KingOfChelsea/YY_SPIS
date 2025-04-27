import httpInstance from "@/utils/OzonHttp";

export const QueryAttributeValueAPI = (attribute_id,description_category_id,type_id) => {
  return httpInstance.post(`/v1/description-category/attribute/values`, {
    "attribute_id": attribute_id,
    "description_category_id":description_category_id,
    "language":"ZH_HANS",
    "last_value_id": 20,
    "limit": 100,
    "type_id":type_id
  });
};
