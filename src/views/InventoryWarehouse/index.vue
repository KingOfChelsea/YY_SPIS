<template>
  <el-container>


    <el-main>
      <el-table :data="warehouses" style="width: 100%">
        <el-table-column prop="WarehouseID" label="仓库ID" width="80"></el-table-column>
        <el-table-column prop="WarehouseName" label="仓库名称"></el-table-column>
        <el-table-column prop="Location" label="位置"></el-table-column>
        <el-table-column prop="ContactPerson" label="联系人"></el-table-column>
        <el-table-column prop="ContactNumber" label="联系电话"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button @click="editWarehouse(row)" size="small">编辑</el-button>
            <el-button @click="deleteWarehouse(row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 添加/编辑仓库 弹窗 -->
    <el-dialog v-model="dialogVisible" title="仓库信息" width="600px">
      <el-form :model="currentWarehouse">
        <el-form-item label="仓库名称">
          <el-input v-model="currentWarehouse.WarehouseName"></el-input>
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="currentWarehouse.Location" readonly @click="openMapDialog"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="currentWarehouse.ContactPerson"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="currentWarehouse.ContactNumber"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveWarehouse">确定</el-button>
      </template>
    </el-dialog>

    <!-- 选择位置的地图弹窗 -->
    <el-dialog v-model="mapDialogVisible" title="选择仓库位置" width="800px" @opened="loadMap">
      <el-input v-model="searchKeyword" placeholder="搜索地址" clearable @input="searchAddress" @clear="clearSearch"
        style="margin-bottom: 10px;" />

      <el-scrollbar v-if="searchResults.length" max-height="250px" class="search-results">
        <el-card v-for="result in searchResults" :key="result.id" shadow="hover" class="result-card"
          @click="selectAddress(result)">
          <div class="result-content">
            <span class="result-name">{{ result.name }}</span>
            <span class="result-address">{{ result.address }}</span>
          </div>
        </el-card>
      </el-scrollbar>

      <div id="map-container" style="width: 100%; height: 400px; border-radius: 6px; overflow: hidden;"></div>

      <template #footer>
        <el-button @click="mapDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmLocation">确定</el-button>
      </template>
    </el-dialog>
    <el-header>
      <el-button type="primary" @click="showAddDialog">添加仓库</el-button>
    </el-header>
  </el-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { getWarehouseAPI } from "@/apis/warehouse/getAll";
import { showMessage } from "@/utils/Ealert";
import { deleteWarehouseAPI } from "@/apis/warehouse/deleteWarehouse";
import { insertWarehouseAPI } from "@/apis/warehouse/insertWarehouse";
import { updateWarehouseAPI } from "@/apis/warehouse/editWarehouse";

// 加载仓库数据，用于渲染表格
onMounted(async () => {
  try {
    const res = await getWarehouseAPI()
    warehouses.value = res.data
    showMessage("success", "数据加载成功！")
  } catch (error) {
    showMessage("danger", error)
  }
})


// 仓库现有数据
const warehouses = ref([
  { WarehouseID: 1, WarehouseName: "广州仓库", Location: "广州市天河区", ContactPerson: "张三", ContactNumber: "123456789" }
]);

const dialogVisible = ref(false);
const mapDialogVisible = ref(false);
const searchKeyword = ref(""); // 收取词
const searchResults = ref([]); // 搜寻结果
const currentWarehouse = ref({ WarehouseName: "", Location: "", ContactPerson: "", ContactNumber: "" }); // 表单数据

let map = null;
let marker = null;
let placeSearch = null;

function showAddDialog() {
  currentWarehouse.value = { WarehouseName: "", Location: "", ContactPerson: "", ContactNumber: "" };
  dialogVisible.value = true;
}

// 编辑填充数据
function editWarehouse(warehouse) {
  currentWarehouse.value = { ...warehouse };
  dialogVisible.value = true;
}

// 创建/更新单个仓库信息
async function saveWarehouse() {
  // 或(||) 两个字段是否为空
  if (!currentWarehouse.value.WarehouseName || !currentWarehouse.value.Location) {
    showMessage("error", "请填写完整信息")
    return;
  }

  // 获取Elment-UI中的表格的索引
  const existingIndex = warehouses.value.findIndex(w => w.WarehouseID === currentWarehouse.value.WarehouseID);

  try {
    // 新增仓库信息
    const res = (await getWarehouseAPI()).data;
    var Id = res[res.length - 1]?.WarehouseID + 1
  } catch (error) {
      showMessage("error",error)
  }
// If（修改）
  if (existingIndex !== -1) {
    try {
      // 后端修改
      const res = await updateWarehouseAPI(warehouses.value[existingIndex].WarehouseID, currentWarehouse.value)
      if (res.success) {
        // 修改仓库信息(前端修改)
        warehouses.value[existingIndex] = { ...currentWarehouse.value };
        showMessage("success", res.message)
      }
    } catch (error) {
      showMessage("error", error)
    }
  }
// else（创建）
  else {
    try {
      currentWarehouse.value.WarehouseID = Id;
      warehouses.value.push({ ...currentWarehouse.value });
      const res = await insertWarehouseAPI(currentWarehouse.value)
      showMessage("success", res.message)
    } catch (error) {
      showMessage("error", error)
    }
  }
  dialogVisible.value = false;
}

// 通过仓库ID，来删除。
async function deleteWarehouse(warehouse) {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      `确定要删除仓库 "${warehouse.WarehouseName}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    // 用户点击“确定”后执行删除
    const res = await deleteWarehouseAPI(warehouse.WarehouseID);
    if (res.success) {
      // 前端删除
      warehouses.value = warehouses.value.filter(w => w.WarehouseID !== warehouse.WarehouseID);
      showMessage("success", res.message)
    } else {
      showMessage("warning", res.message)
    }

  } catch (error) {

    // 用户点击“取消” 或者 API 请求失败时的处理
    if (error !== 'cancel') {
      showMessage("error", error)
    }
  }
}

function openMapDialog() {
  mapDialogVisible.value = true;
}

// 生成地图
function loadMap() {
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

// 查询地图
function searchAddress() {
  if (!searchKeyword.value.trim() || !placeSearch) return;
  placeSearch.search(searchKeyword.value, (status, result) => {
    if (status === "complete" && result.poiList) {
      searchResults.value = result.poiList.pois;
    } else {
      searchResults.value = [];
    }
  });
}

function getAddressFromCoords(lng, lat) {
  AMap.plugin("AMap.Geocoder", function () {
    const geocoder = new AMap.Geocoder();
    geocoder.getAddress([lng, lat], function (status, result) {
      if (status === "complete" && result.regeocode) {
        updateLocation(result.regeocode.formattedAddress, lng, lat);
      }
    });
  });
}

// 更新地址
function updateLocation(name, lng, lat) {
  currentWarehouse.value.Location = name;
  if (!marker) {
    marker = new AMap.Marker({ position: [lng, lat], map });
  } else {
    marker.setPosition([lng, lat]);
  }
  map.setCenter([lng, lat]);
  showMessage("success", `选中：${name}`)
}

function confirmLocation() {
  if (!currentWarehouse.value.Location) {
    showMessage("error", "请先选择一个位置")
    return;
  }
  mapDialogVisible.value = false;
}

const clearSearch = () => {
  searchKeyword.value = "";
  searchResults.value = []; // 清空搜索框时隐藏结果[结果]
};

const selectAddress = (result) => {
  searchKeyword.value = result.name;
  updateLocation(result.name, result.location.lng, result.location.lat);
  searchResults.value = []; // 选中地址后隐藏搜索结果
};

</script>

<style scoped>
.search-results {
  position: absolute;
  width: 300px;
  height: 300px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
}

.result-card {
  margin-bottom: 8px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.result-card:hover {
  transform: scale(1.02);
}

.result-content {
  display: flex;
  flex-direction: column;
}

.result-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.result-address {
  font-size: 12px;
  color: #666;
  margin-top: 3px;
}
</style>
