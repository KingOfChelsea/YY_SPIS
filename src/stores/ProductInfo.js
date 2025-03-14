import { searchProductData } from "@/apis/searchProduct";
import { showMessage } from "@/utils/Ealert";
import { defineStore } from "pinia";
import { ref } from "vue";


/*
 * @Description:派单数据
 * @Author: Zane Xu
 * @Date: 2025-03-13 16:05:34
 * @LastEditTime: 2025-03-13 16:37:23
 * @LastEditors: Zane Xu
 */


export const GetProductDataStore = defineStore("ProductData", () => {
  // 产品信息ref
  const ProductData = ref([]);
  // 通过接口获取
  const GetProductData = async () => {
    try {
      //传入空参数 => 必须要{}
      const res = await searchProductData({});
      if (res.success) {
        ProductData.value = res.data;
        // console.log(ProductData.value);
        /** showMessage("error", res.message) 不需要提示，体验感差  */
      } else {
        showMessage("error", res.message);
      }
    } catch (error) {
      showMessage("error",error)
    }
  };
  return {
    GetProductData,ProductData
  }
});
