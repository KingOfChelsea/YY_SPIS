/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-04-23 17:49:15
 * @LastEditTime: 2025-04-25 15:54:45
 * @LastEditors: Zane Xu
 */
import { ref } from "vue"
import { defineStore } from "pinia"
import { QueryAttribute } from "@/apis/ozon/DescriptionCategory/QueryAttribute"
import { showMessage } from "@/utils/Ealert"

export const useOzonAttributeStore = defineStore("useOzonAttribute", () => {
  const OzonAttributeList = ref([])

  const getOzonAttributeList = async(CategoryId,TypeId)=>{
    try {
      const res =  await QueryAttribute(CategoryId,TypeId)
      if (res.code==3) {
        return showMessage("error",error)
      }else{
        // OzonAttributeList.value = res.result;
        OzonAttributeList.value = await res.result.sort((a, b) => a.id - b.id);
      }
    } catch (error) {
        return showMessage("error",error)
    }

  }
  return {
    OzonAttributeList,
    getOzonAttributeList
  }
})
