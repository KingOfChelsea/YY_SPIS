import httpInstance from "@/utils/http";

export const getRoleDataAPI = (role_id) => {
  return httpInstance.get(`/roles/get-all`, );
};

