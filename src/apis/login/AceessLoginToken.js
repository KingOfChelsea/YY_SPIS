
/**
 * @description:
 * @Author: Zane Xu
 * @Date: 2025-02-28 16:01:43
 * @LastEditTime: Do not edit
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";
/**
 *
 * @param {验证码} verificationCode
 * @param {ID身份} userId
 * @returns
 */
export const AccessLoginTokenAPI = (verificationCode,userId) => {
  return httpInstance.post(`/users/Generation-Token?userId=${userId}&verificationCode=${verificationCode}`);
};
