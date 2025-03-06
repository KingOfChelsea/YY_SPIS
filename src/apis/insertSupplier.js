import httpInstance from "@/utils/http";

export const insertSupplierAPI = (form) => {
  return httpInstance.post(`/suppliers`, {
    "SupplierName": form.SupplierName,
    "ContactPerson": form.ContactPerson,
    "ContactNumber": form.ContactNumber,
    "Address": form.Address,
  });
};
