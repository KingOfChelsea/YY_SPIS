import JsBarcode from "jsbarcode";

/**
 * 生成条形码
 * @param {string} code 条形码内容
 * @param {string} svgElement 绑定的 SVG 元素
 */

export const generateBarcode = (svgElement, code) => {
  if (svgElement && code) {
    JsBarcode(svgElement, code, {
      format: "CODE128",
      displayValue: true,
      fontSize: 14,
      lineColor: "#000",
      width: 2,
      height: 50,
    });
  }
};
