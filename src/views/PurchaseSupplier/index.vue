<template>
    <!-- 创建供应商 -->
    <el-text type="primary" size="large" >创建供应商</el-text>
    <div class="supplier_container">
    <div class="supplier-create-form">
      <el-form :model="Createform" :rules="formRules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="SupplierName">
              <el-input v-model="Createform.SupplierName" placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="联系人姓名" prop="ContactPerson">
              <el-input v-model="Createform.ContactPerson" placeholder="请输入联系人姓名"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="联系人电话" prop="ContactNumber">
              <el-input v-model="Createform.ContactNumber" placeholder="请输入联系人电话"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="厂家地址" prop="Address">
              <el-input v-model="Createform.Address" placeholder="请输入厂家地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="supplier-create-button">
      <el-button type="primary" @click="handleInsert">创建</el-button>
      <el-button @click="clearFormData(Createform)">重置</el-button>
    </div>
  </div>

  <el-divider />
  <el-text type="primary" size="large" >供应商查询</el-text>
  <div class="supplier-search-container">
    <div class="supplier-search-form">
      <el-form :model="Searchform" label-width="150px" >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="供应商名称">
              <el-input v-model="Searchform.SupplierName" placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人名称">
              <el-input v-model="Searchform.ContactPerson" placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称">
              <el-input v-model="Searchform.name" placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话">
              <el-input v-model="Searchform.ContactNumber" placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商地址">
              <el-input v-model="Searchform.Address" placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-date-picker v-model="Searchform.CreatedAt" type="date" placeholder="选择开始时间" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div class="supplier-search-button">
        <el-button type="primary" @click="research()">查询</el-button>
        <el-button  @click="clearFormData(Searchform)" >重置</el-button>
      </div>
    </div>
    <el-divider />

<!-- <el-text type="primary" size="large" style="text-align: left;">供应商</el-text>
  -->
<!-- <h3>供应商详情</h3> -->
 <el-text type="primary" size="large"  style="text-align: left;" >创建供应商</el-text>
    <div class="supplier-search-table">
      <el-table :data="tableData" border  max-height="250px" style="overflow: auto;">
        <el-table-column prop="CreatedAt" label="创建时间" width="180" />
        <el-table-column prop="SupplierName" label="供应商名称" width="180" />
        <el-table-column prop="ContactPerson" label="联系人姓名" width="180" />
        <el-table-column prop="ContactNumber" label="联系电话" width="180" />
        <el-table-column prop="Address" label="地址" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue';
import { insertSupplierAPI } from "@/apis/insertSupplier"
import { getSupplierData,searchSupplierData } from "@/apis/getSupplierData"
import { showMessage } from "@/utils/Ealert"
import { clearFormData } from "@/utils/tools"

// 搜寻表单
const Searchform = ref({
  SupplierName: '',
  ContactPerson: null,
  ContactNumber: null,
  Address: null,
  CreatedAt: null,
});

// 创建表单
const Createform = ref({
  SupplierName: '',
  ContactPerson: null,
  ContactNumber: null,
  Address: null,
});

// 表单验证规则 -----> Createform
const formRules = ref({
  SupplierName: [{ required: true, message: '请输入中文/英文', trigger: 'blur', pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/ }],
  ContactPerson: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur', pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/ }],
  ContactNumber: [{ required: true, message: '联系人电话不能为空', trigger: 'blur', pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/ }],
  Address: [{ required: true, message: '厂家地址不能为空', trigger: 'blur', pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/ }],
});

const tableData = ref([])
onMounted(async () => {
  const res = await getSupplierData()
  // console.log(res);
  tableData.value = res.data
})


const formRef = ref(null);
const handleInsert = async () => {
  try {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        const res = await insertSupplierAPI(Createform.value);
        showMessage('success', res.message); // console.log(res);代替
        // 处理插入后的逻辑
        clearFormData(Createform.value)
      } else {
        showMessage('warning', "上传失败!");
        return false; // 阻止提交
      }
    });
  } catch (error) {
    showMessage('warning', error.message);
  }
  // 触发表单验证


};

const research = async () =>{
  const {SupplierName,ContactPerson,ContactNumber,Address,CreatedAt} = toRefs(Searchform.value);
  const result = {
    SupplierName: SupplierName.value,
    ContactPerson: ContactPerson.value,
    ContactNumber: ContactNumber.value,
    Address: Address.value,
    CreatedAt: CreatedAt.value,
  };

  try {
    const res = await searchSupplierData(result)
    console.log(res.data);
    if(res.success == false){
      showMessage('warning', res.message);
    }else{
      showMessage('success', "查询成功"); // console.log(res);
      tableData.value = res.data
    }
  } catch (error) {
    showMessage('error',error)
  }



}
</script>

<style scoped lang="scss">
.supplier_container {
  display: flex;
  flex-direction: column;
  justify-content: end;
  flex-grow: 1;

  .supplier-create-button {
    display: flex;
    justify-content: center;
  }
}



.supplier-search-container {
  display: flex;
  flex-direction: column;
  justify-content:end;
  .supplier-search-table{
    margin-left: 40px;
    box-sizing: border-box;
    align-items: center;
    }
    .supplier-search-form {
    display: flex;
    flex-direction: column;

    .supplier-search-button{
      margin: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content:last baseline;
    }

  }
}
</style>
