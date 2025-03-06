import httpInstance from "@/utils/http";

export const insertPurchaseordersAPI = (form) => {
  return httpInstance.post(`/purchaseorders/create`, {
    "SupplierID": form.SupplierID,
    "EmployeeID": form.EmployeeID,
    "Details": form.Details
});
};
