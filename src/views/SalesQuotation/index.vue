<!--
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-11 15:11:30
 * @LastEditTime: 2025-03-12 15:18:05
 * @LastEditors: Zane Xu
-->
<template>
  <el-container class="quote-container">
    <el-header class="header1">
      <h2>📜 客户报价单</h2>
    </el-header>

    <el-main>
      <el-card shadow="hover" class="form-card">
        <el-form ref="quoteForm" :model="quoteData" label-width="120px">

          <!-- 选择客户 -->
          <el-form-item label="客户" prop="customer">
            <el-select v-model="quoteData.customer" placeholder="选择客户" @change="updateCustomerInfo">
              <el-option v-for="cust in CustomerData.CustomersData" :key="cust.CustomerID" :label="`编号:${cust.CustomerID} | 姓名:${cust.CustomerName}`"    :value="cust.CustomerID" />
            </el-select>
          </el-form-item>

          <!-- 关联邮箱 -->
          <el-form-item label="客户邮箱">
            <el-input v-model="quoteData.email" readonly placeholder="自动填充客户邮箱" />
          </el-form-item>

          <!-- 关联电话 -->
          <el-form-item label="客户电话">
            <el-input v-model="quoteData.phone" readonly placeholder="自动填充客户电话" />
          </el-form-item>

          <!-- 添加报价产品 -->
          <el-table :data="quoteData.products" border stripe>
            <el-table-column label="产品" prop="product"width="140" >
              <template #default="{ row }">
                <el-select v-model="row.product" placeholder="选择产品" @change="updatePrice(row)">
                  <el-option v-for="prod in products" :key="prod.ProductID" :label="prod.ProductName" :value="prod.ProductID" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="单价" prop="price" width="120">
              <template #default="{ row }">
                <el-input v-model="row.price" readonly />
              </template>
            </el-table-column>

            <el-table-column label="数量" prop="quantity" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.quantity" :min="1" @change="calculateTotal" />
              </template>
            </el-table-column>

            <el-table-column label="小计" prop="subtotal" width="120">
              <template #default="{ row }">
                <el-input v-model="row.subtotal" readonly />
              </template>
            </el-table-column>

            <el-table-column label="操作" width="80">
              <template #default="{ row, $index }">
                <el-button type="danger" size="small" @click="removeProduct($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-button type="primary" @click="addProduct" class="add-btn">添加产品</el-button>

          <!-- 总价 -->
          <el-form-item label="总价" class="total-price">
            <el-input  v-model="quoteData.totalPrice" readonly />
          </el-form-item>

          <!-- 操作按钮 -->
          <el-form-item>
            <el-button type="success" @click="submitQuote">提交报价</el-button>
            <el-button type="warning" @click="exportToPDF">导出 PDF</el-button>
            <el-button type="primary" @click="sendEmail">发送邮件</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>


<script setup>

import { useCustomersDataStore } from "@/stores/fetchCustomerData";
import { ref, reactive, onMounted } from "vue";

const CustomerData = useCustomersDataStore()

const quoteData = reactive({
  customer: null,
  email: "",
  phone: "",
  products: [],
  totalPrice: 0
});

const products = ref([]);

// **获取客户 & 产品数据**
onMounted(async () => {
  CustomerData.getCustomerData()
});

// **更新客户信息**
const updateCustomerInfo = () => {
  const selectedCustomer = CustomerData.CustomersData.find(cust => cust.CustomerID === quoteData.customer);
  if (selectedCustomer) {
    quoteData.email = selectedCustomer.Email;
    quoteData.phone = selectedCustomer.ContactNumber;
  }
};

// **添加产品**
const addProduct = () => {
  quoteData.products.push({ product: null, price: 0, quantity: 1, subtotal: 0 });
};

// **更新产品价格**
const updatePrice = (row) => {
  const selectedProduct = products.value.find(prod => prod.ProductID === row.product);
  if (selectedProduct) {
    row.price = selectedProduct.UnitPrice;
    row.subtotal = row.price * row.quantity;
    calculateTotal();
  }
};

// **计算总价**
const calculateTotal = () => {
  quoteData.totalPrice = quoteData.products.reduce((sum, item) => sum + item.subtotal, 0);
};

// **删除产品**
const removeProduct = (index) => {
  quoteData.products.splice(index, 1);
  calculateTotal();
};

// **提交报价**
const submitQuote = () => {
  ElMessage.success("报价单已提交！");
};

// **导出 PDF**
const exportToPDF = () => {
  ElMessage.success("报价单已导出 PDF！");
};

/**发送邮件*/
const sendEmail = async () => {
  try {
    // const res = await sendQuoteEmailAPI(quoteData);
    if (res.success) {
      ElMessage.success("报价单已发送至客户邮箱！");
    } else {
      ElMessage.error(res.message);
    }
  } catch (error) {
    ElMessage.error("邮件发送失败：" + error.message);
  }
};
</script>


<style scoped>
.quote-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header1 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.form-card {
  /* max-width: 10000px; */
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.add-btn {
  margin-top: 15px;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}
</style>

