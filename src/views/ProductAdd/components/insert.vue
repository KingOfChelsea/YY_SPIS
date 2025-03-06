<template>
  <el-text size="large" type="primary">⏫ 上传产品</el-text>
  <el-form :model="formData" label-width="120px" ref="form" class="form-container">
    <el-row :span="24">
      <el-col :span="8">
        <el-form-item label="产品名称" prop="ProductName"
          :rules="[{ required: true, message: '请输入产品名称', trigger: 'blur' }]">
          <el-input v-model="formData.ProductName" placeholder="请输入产品名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="类别" prop="Category" :rules="[{ required: true, message: '请选择类别', trigger: 'blur' }]">
          <el-select v-model="formData.Category" placeholder="请选择类别">
            <el-option label="白酒" value="白酒"></el-option>
            <el-option label="葡萄酒" value="葡萄酒"></el-option>
            <el-option label="啤酒" value="啤酒"></el-option>
            <el-option label="3C电子产品" value="3C电子产品"></el-option>
            <el-option label="Ozon" value="Ozon"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单位" prop="Unit" :rules="[{ required: true, message: '请输入单位', trigger: 'blur' }]">
          <el-select v-model="formData.Unit" placeholder="请选择单位">
            <el-option label="瓶" value="瓶"></el-option>
            <el-option label="箱" value="箱"></el-option>
            <el-option label="包" value="包"></el-option>
            <el-option label="件" value="件"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单价" prop="UnitPrice"
          :rules="[{ required: true, message: '请输入单价', trigger: 'blur' }, { type: 'number', message: '单价必须是数字', trigger: 'blur' }]">
          <el-input-number v-model="formData.UnitPrice" :min="0" placeholder="请输入单价" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="货号" prop="SerialNumber">
          <el-input v-model="formData.SerialNumber" readonly placeholder="自动生成货号" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="条形码">
          <svg style="height: 50px;" ref="barcodeSvg"></svg>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formData)">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
  <el-divider />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { generateBarcode } from "@/utils/Barcode";
import { insertProductAPI } from "@/apis/insertProduct";
import ProductCodeGenerator from "@/utils/productCodeGenerator";
import { showMessage } from "@/utils/Ealert";
import { clearFormData } from "@/utils/tools";

const formData = ref({
  ProductName: "",
  Category: "",
  Unit: "",
  UnitPrice: 0,
  SerialNumber: "",
});

const barcodeSvg = ref(null); // 绑定 SVG 生成条形码

// 监听 SerialNumber 变化，自动更新条形码
watch(() => formData.value.SerialNumber, (newCode) => {
  if (newCode) {
    generateBarcode(barcodeSvg.value, newCode);
  }
});

// 监听 ProductName 和 Category 变化，自动生成货号
watch([() => formData.value.ProductName, () => formData.value.Category], () => {
  if (formData.value.ProductName && formData.value.Category) {
    formData.value.SerialNumber = ProductCodeGenerator.generateCode(formData.value);
  } else {
    formData.value.SerialNumber = "";
  }
});

// 提交表单
const submitForm = async (form) => {
  try {
    await insertProductAPI(form);
    showMessage("success","提交成功！")
    clearFormData(formData.value);
    generateBarcode(barcodeSvg.value, "");
  } catch (error) {
    showMessage("warning",error)
  }
};

// 重置表单
const resetForm = () => {
  clearFormData(formData.value);
  generateBarcode(barcodeSvg.value, "");
};


// 初始化条形码
onMounted(() => {
  generateBarcode(barcodeSvg.value, formData.value.SerialNumber);
});

</script>
