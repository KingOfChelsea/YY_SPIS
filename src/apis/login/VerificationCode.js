/**
 * @description:
 * @return {*}
 * @Author: Zane Xu
 * @Date: 2025-02-28 10:16:04
 * @LastEditTime: Do not edit
 * @LastEditors: Zane Xu
 */
import httpInstance from "@/utils/http";

export const getVerificationCodeAPI = (form) => {
  return httpInstance.post(`/users/send-verification-code`, form);
};

