/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-18 10:17:31
 * @LastEditTime: 2025-03-18 10:18:08
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

/** 发送报价单邮件 Created By Zane Xu 2025-3-12 */
export const SnedQuotationAPI = (email,orderId) => {
  return httpInstance.post(`/quotes/send-quote`,{"CustomerEmail":email,"OrderId":orderId});
};
