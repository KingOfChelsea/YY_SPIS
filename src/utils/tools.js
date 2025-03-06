// utils.js
/**
 *
 * @param {object} formData
 */
export function clearFormData(formData) {
  for (let key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const value = formData[key];

      // 根据数据类型赋默认值
      if (typeof value === "number") {
        formData[key] = "";
      } else if (typeof value === "boolean") {
        formData[key] = false;
      } else if (Array.isArray(value)) {
        formData[key] = [];
      } else if (typeof value === "object" && value !== null) {
        formData[key] = {}; // 避免 null
      } else {
        formData[key] = "";
      }
    }
  }
}

