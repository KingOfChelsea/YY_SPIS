import httpInstance from "@/utils/OzonHttp";

export const QueryGoodsCategoryTree = () => {
  return httpInstance.post(`/v1/description-category/tree`, {
    "language":"ZH_HANS",
  });
};