/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-27 10:57:25
 * @LastEditTime: 2025-03-27 11:05:40
 * @LastEditors: Zane Xu
 */
/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-27 10:57:25
 * @LastEditTime: 2025-03-27 11:00:48
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const UpdateStocksAPI =(PurchaseOrderID)=>{
  return httpInstance.post(`/purchaseorders/addstock?PurchaseOrderID=${PurchaseOrderID}`)
}
