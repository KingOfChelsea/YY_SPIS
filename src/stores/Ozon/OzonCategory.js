import { ref } from "vue"
import { defineStore } from "pinia"
import { QueryGoodsCategoryTree } from "@/apis/ozon/DescriptionCategory/QueryDescriptionCategoryTree"

const ONE_DAY = 24 * 60 * 60 * 1000 // 一天的毫秒数

export const useOzonCategoryStore = defineStore("OzonCategory", () => {
  const OzonCategoryList = ref([])
  const cascaderProps = {
    expandTrigger: 'hover',
    checkStrictly: false,
    emitPath: true,
    label: 'label',
    value: 'value',
    children: 'children'
  }
  const getOzonCategoryList = async () => {
    const now = Date.now()
    const cacheTime = localStorage.getItem("OzonCategoryCacheTime")

    // 有缓存时间且数据未过期，从本地加载
    if (cacheTime && now - Number(cacheTime) < ONE_DAY) {
      const localData = localStorage.getItem("OzonCategoryList")
      if (localData) {
        OzonCategoryList.value = JSON.parse(localData)
        return
      }
    }

    // 否则重新请求并更新缓存
    const res = await QueryGoodsCategoryTree()
    OzonCategoryList.value = formatCategories(res.result || []) 

    // 缓存数据和时间戳
    localStorage.setItem("OzonCategoryList", JSON.stringify(OzonCategoryList.value))
    localStorage.setItem("OzonCategoryCacheTime", String(now))
  }

  const clearCache = () => {
    localStorage.removeItem("OzonCategoryList")
    localStorage.removeItem("OzonCategoryCacheTime")
    OzonCategoryList.value = []
  }
  
  const formatCategories=(data)=> {
  return data.map(item => {
    const isThirdLevel = item.type_id !== undefined
    return {
      label: isThirdLevel ? item.type_name : item.category_name,
      value: isThirdLevel ? item.type_id : item.description_category_id,
      disabled: item.disabled || false,
      children: item.children ? formatCategories(item.children) : []
    }
  })
}

  return {
    OzonCategoryList,
    cascaderProps,
    getOzonCategoryList,
    clearCache
  }
})
