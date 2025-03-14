/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-01-24 14:58:27
 * @LastEditTime: 2025-03-13 16:04:21
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

/*
请求数据
{
  "SupplierID": 1,
  "SupplierName": "汾酒厂",
  "ContactPerson": "王小明",
  "ContactNumber": "13900000001",
  "Address": "山西省汾阳市汾酒厂",
  "CreatedAt": "2025-01-21T11:13:54+08:00"
}
*/
export const getSupplierData = () => {
  return httpInstance.get(`/suppliers/data`);
};

export const searchSupplierData =(form)=>{
  return httpInstance.post(`/suppliers/search`,form)
}
