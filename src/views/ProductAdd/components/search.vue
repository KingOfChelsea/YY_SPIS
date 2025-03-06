<template>
  <el-text size="large" type="primary">🔎查询产品</el-text>
  <el-form :model="searchData" @submit.prevent="handleSearch">
    <el-row :span="24">
        <!-- 产品名称查询 -->
        <el-col :span="6">
          <el-form-item label="产品名称" prop="ProductName">
            <el-input v-model="searchData.ProductName" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <!-- 类别查询 -->
          <el-form-item label="类别" prop="Category">
            <el-select v-model="searchData.Category" placeholder="请选择类别">
              <el-option label="食品" value="食品"></el-option>
              <el-option label="白酒" value="白酒"></el-option>
              <el-option label="饮料" value="饮料"></el-option>
              <el-option label="3C电子产品" value="3C电子产品"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 单价范围查询 -->
        <el-col :span="6">
          <el-form-item label="单价范围" prop="UnitPriceRange">
            <el-input-number v-model="searchData.UnitPriceRange" :min="0" :step="1" placeholder="最低价" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <!-- 库存数量查询 -->
          <el-form-item label="库存数量" prop="StockQuantityRange">
            <el-row :gutter="20">
              <el-col :span="20">
                <el-input-number v-model="searchData.StockQuantityRange" placeholder="库存数量" style="width: 100%"></el-input-number>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

    </el-row>

    <!-- 查询按钮 -->
    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>

  <el-divider />

 <!-- 查询结果展示 -->
<el-text size="large" type="primary">产品数据</el-text>

<!-- 设置外部容器的宽度并添加overflow-x: auto -->
<div style="overflow-x: auto; margin-top: 10px;">
  <el-table :data="products" border max-height="300px" style="width: 1200px; table-layout: auto;">
    <el-table-column fixed prop="ProductID" label="产品ID" width="100"></el-table-column>
    <el-table-column prop="ProductName" label="产品名称" min-width="100"></el-table-column>
    <el-table-column prop="Category" label="类别" width="150"></el-table-column>
    <el-table-column prop="Unit" label="单位" width="100"></el-table-column>
    <el-table-column prop="UnitPrice" label="单价" width="100"></el-table-column>
    <el-table-column prop="StockQuantity" label="库存数量" width="120"></el-table-column>
    <el-table-column prop="CreatedAt" label="创建日期" width="150"></el-table-column>

    <!-- 条形码列 -->
    <el-table-column prop="SerialNumber" label="条形码" width="190">
      <template #default="{ row }">
        <svg :id="'barcode-' + row.SerialNumber" style="height: 30px; width: 100%; max-width: 150px; overflow: hidden; margin: auto;"></svg>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import JsBarcode from 'jsbarcode';
import { searchProductData } from "@/apis/searchProduct";
import { showMessage } from '@/utils/Ealert';

// 产品数据
const products = ref([]);

// 查询条件
const searchData = ref({
  ProductName: '',
  Category: '',
  UnitPriceRange: null,
  StockQuantityRange: null,
});

// 查询处理
const handleSearch = async () => {
  const { ProductName, Category, UnitPriceRange, StockQuantityRange } = searchData.value;
  const form = {
    ProductName,
    Category,
    UnitPrice: UnitPriceRange,
    StockQuantity: StockQuantityRange
  };

  try {
    // 调用后端接口，传递查询条件
    const res = await searchProductData(form);
    products.value = res.data; // 更新查询结果
    showMessage("success", "查询成功");
  } catch (error) {
    showMessage("error", error);
  }
};

// 重置查询条件
const handleReset = () => {
  searchData.value = {
    ProductName: '',
    Category: '',
    UnitPriceRange: null,
    StockQuantityRange: null
  };
};

// 监听产品数据变化并生成条形码
watch(products, (newTableData) => {
  // 确保 newTableData 是一个有效的数组
  if (Array.isArray(newTableData)) {
    // 延迟执行条形码生成，确保 DOM 已渲染
    nextTick(() => {
      newTableData.forEach((row) => {
        generateBarcode(row.SerialNumber);
      });
    });
  }
}, { immediate: true }); // 初次渲染时立即生成条形码

// 生成条形码的方法
const generateBarcode = (serialNumber) => {
  nextTick(() => {
    const barcodeElement = document.getElementById(`barcode-${serialNumber}`);
    if (barcodeElement) {
      JsBarcode(barcodeElement, serialNumber, {
        format: "CODE128",
        displayValue: true,
        fontSize: 10,
        lineColor: "#000",
        width: 2,
        height: 20,
      });
    }
  });
};
</script>

<style scoped>
.search-form {
  width: 600px;
  margin: 20px auto;
}

.product-search-table {
  overflow: auto;
}
</style>
