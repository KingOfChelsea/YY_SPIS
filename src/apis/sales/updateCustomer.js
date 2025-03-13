import httpInstance from "@/utils/http";

export const updateCustomerAPI  = (RoleID,form) => {
  return httpInstance.post(`/customers/update-customer?RoleID=${RoleID}`,form);
};
