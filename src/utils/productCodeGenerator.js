import { pinyin } from "pinyin-pro";

const generateCode = (formData) => {
  if (!formData.ProductName || !formData.Category) return "";

  // 获取拼音首字母
  const productPinyin = pinyin(formData.ProductName, { toneType: "none", type: "array" });
  const categoryPinyin = pinyin(formData.Category, { toneType: "none", type: "array" });

  const productAbbr = productPinyin.map(word => word[0]).join("").toUpperCase();
  const categoryAbbr = categoryPinyin.map(word => word[0]).join("").toUpperCase();

  // 取时间戳后5位，保证一定的唯一性
  const timestamp = Date.now().toString().slice(-5);

  // 组合货号
  return `${categoryAbbr}-${productAbbr}-${timestamp}`;
};

export default { generateCode };
