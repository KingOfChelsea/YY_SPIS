<!--
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-11 17:19:48
 * @LastEditTime: 2025-03-11 17:36:19
 * @LastEditors: Zane Xu
-->
<template>
  <el-container>
    <!-- <el-header>
      <el-text>📝 创建买家</el-text>
    </el-header> -->

    <el-main>
      <el-card shadow="hover" class="form-card">
        <div style="display: flex;justify-content:first baseline;gap: 25px;">
          <el-avatar :size="80"
        src="https://raw.githubusercontent.com/KingOfChelsea/MarkdownPicGo/main/202411211121303.png" />
        <el-text size=large type="primary">📝 客户信息创建</el-text>
        </div>
        <el-form ref="customerForm" :model="customerData" :rules="rules" label-width="100px">
          <el-form-item label="买家姓名" prop="CustomerName">
            <el-input v-model="customerData.CustomerName" placeholder="请输入买家姓名" />
          </el-form-item>

          <el-form-item label="联系方式" prop="ContactNumber">
            <el-input v-model="customerData.ContactNumber" placeholder="请输入手机号码" />
          </el-form-item>

          <el-form-item label="电子邮件" prop="Email">
            <el-input v-model="customerData.Email" placeholder="请输入电子邮件" />
          </el-form-item>

          <el-form-item label="买家地址" prop="Address">
            <el-input v-model="customerData.Address" type="textarea" placeholder="请输入买家地址" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>


<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { createCustomerAPI } from "@/apis/sales/createCustomer"; // 创建客户的 API

// **表单数据**
const customerData = reactive({
  CustomerName: "",
  ContactNumber: "",
  Email: "",
  Address: "",
});

// **表单校验规则**
const rules = {
  CustomerName: [{ required: true, message: "请输入买家姓名", trigger: "blur" }],
  ContactNumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" },
  ],
  Email: [{ type: "email", message: "请输入有效的邮箱地址", trigger: "blur" }],
  Address: [{ required: true, message: "请输入买家地址", trigger: "blur" }],
};

// **表单引用**
const customerForm = ref(null);

// **提交按钮状态**
const loading = ref(false);

// **提交表单**
const handleSubmit = () => {
  customerForm.value.validate(async (valid) => {
    if (!valid) return;

    try {
      loading.value = true;
      const res = await createCustomerAPI(customerData);

      if (res.success) {
        ElMessage.success("客户创建成功！");
        resetForm();
      } else {
        ElMessage.error(res.message);
      }
    } catch (error) {
      ElMessage.error("创建客户失败：" + error.message);
    } finally {
      loading.value = false;
    }
  });
};

// **重置表单**
const resetForm = () => {
  customerForm.value.resetFields();
};

</script>


<style scoped>
.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.form-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

