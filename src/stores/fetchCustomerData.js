import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCustomersAPI } from '@/apis/sales/fetchCustomers'

export const useCustomersDataStore  = defineStore('CustomersData',() =>{
  const CustomersData  = ref([])
  const getCustomerData = async()=>{
    const res = await fetchCustomersAPI()
    CustomersData.value = res.data
  };
  return{
    getCustomerData,
    CustomersData
  }
})
