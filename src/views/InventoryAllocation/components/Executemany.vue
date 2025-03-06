<template>
  <el-container>
    <el-header>
      <h2>批量上传入库分配</h2>
    </el-header>

    <el-main>

      <!-- 上传文件 -->
      <el-form :model="form" label-width="120px">
        <el-form-item label="上传文件" :rules="[{ required: true, message: '请上传文件', trigger: 'blur' }]">
          <el-upload action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" ref="upload"
            :before-upload="beforeUpload" :on-change="handleFileChange" accept=".csv, .xlsx">
            <el-button type="primary">选择文件上传</el-button>
          </el-upload>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitData">提交</el-button>
        </el-form-item>
        <!-- 上传文件预览 -->
        <el-table v-if="filePreview.length > 0" :data="filePreview" style="width: 100%">
          <el-table-column prop="ProductName" label="产品名称"></el-table-column>
          <el-table-column prop="Quantity" label="入库数量"></el-table-column>
          <el-table-column prop="SupplierName" label="供应商名称"></el-table-column>
          <el-table-column prop="WarehouseName" label="仓库名称"></el-table-column>
        </el-table>


      </el-form>

    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';


const form = ref({});
const filePreview = ref([]);

function beforeUpload(file) {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'text/csv';
  if (!isExcel) {
    ElMessage.error('只能上传 .csv 或 .xlsx 文件');
  }
  return isExcel;
}

// 处理文件选择后
function handleFileChange(file, fileList) {
  const reader = new FileReader();
  reader.onload = (e) => {

    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });

    // 选择第一个工作表
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // 将工作表数据转换为 JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // 打印 JSON 数据
    console.log(jsonData);

    // 将数据保存到预览中
    filePreview.value = jsonData;
  };

  reader.readAsBinaryString(file.raw);
}

// 提交数据
function submitData() {
  if (filePreview.value.length === 0) {
    ElMessage.error('请上传并确认文件');
    return;
  }

  // 这里只是打印数据
  console.log('提交的数据:', filePreview.value);
  ElMessage.success('入库分配提交成功！');
}
</script>

<style scoped>
.el-dialog {
  border-radius: 6px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 10px;
}

.el-table {
  margin-top: 20px;
}
</style>
