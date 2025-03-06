/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-02-28 16:38:37
 * @LastEditTime: 2025-02-28 16:42:13
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const verifyTokenAPI = (token) => {
  return httpInstance.post(`/users/parse-token?token=${token}`);
};
