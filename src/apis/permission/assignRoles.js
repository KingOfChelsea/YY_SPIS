import httpInstance from "@/utils/http";

export const assignRoleAPI = (form) => {
  return httpInstance.post(`/permissions/assign-role-permissions`, form);
};
