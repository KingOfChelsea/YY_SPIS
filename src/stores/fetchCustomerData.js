/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-12 17:20:00
 * @LastEditTime: 2025-03-13 16:29:56
 * @LastEditors: Zane Xu
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCustomersAPI } from '@/apis/sales/fetchCustomers'
import { showMessage } from '@/utils/Ealert'

export const useCustomersDataStore  = defineStore('CustomersData',() =>{
  const CustomersData  = ref([])

  const getCustomerData = async()=>{
    try {
      const res = await fetchCustomersAPI({})
      CustomersData.value = res.data
    } catch (error) {
      showMessage("error",error)
    }
  };
  return{
    getCustomerData,
    CustomersData
  }
})
