import httpInstance from "@/utils/http";

export const getSideBarAPI = (role_id) => {
  return httpInstance.post(`/menus`, {
    "UserID":role_id,
  });
};

