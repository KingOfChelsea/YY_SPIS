import AMapLoader from "@amap/amap-jsapi-loader";
import { nextTick } from "vue";

let map = null;
let marker = null;
let placeSearch = null;
export function loadMap() {

  nextTick(() => {
    if (map) return;
    window._AMapSecurityConfig = { securityJsCode: "d4d2aae2a1d252ac74dc293a20e285da" }; // 安全密钥

    AMapLoader.load({
      key: "e0bbbba41e2b06456a37dce462f27808", // 密钥
      version: "2.0",
      plugins: ["AMap.PlaceSearch", "AMap.Geocoder"],
    })
      .then((AMap) => {
        map = new AMap.Map("map-container", {
          zoom: 14,
          center: [113.264385, 23.129112],
        });

        placeSearch = new AMap.PlaceSearch({ pageSize: 10, pageIndex: 1 });

        map.on("click", (e) => {
          getAddressFromCoords(e.lnglat.lng, e.lnglat.lat);
        });
      })
      .catch(error => console.error("高德地图 API 加载失败", error));
  });
}
