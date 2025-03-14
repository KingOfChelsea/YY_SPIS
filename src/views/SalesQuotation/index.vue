<!--
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-11 15:11:30
 * @LastEditTime: 2025-03-14 10:07:09
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

          <!--  -----报价单------  -->
          <el-table :data="quoteData.products" border stripe>

            <el-table-column label="产品" prop="product" width="180" >
              <template #default="{ row }">
                <el-select v-model="row.product" placeholder="选择产品" @change="updatePrice(row)">
                  <el-option v-for="prod in ProductData.ProductData" :key="prod.ProductID" :label= "`${prod.ProductID}-${prod.ProductName}`" :value="prod.ProductID" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="单价" prop="price" max-width="150">
              <template #default="{ row }">
                <el-input v-model="row.price" readonly />
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="unit" max-width="150">
              <template #default="{ row }">
                <el-input v-model="row.unit" readonly />
              </template>
            </el-table-column>

            <el-table-column label="数量" prop="quantity" min-width="180"  >
              <template #default="{ row }">
                <el-input-number  v-model="row.quantity" :min="1" @change="calculateSubtotal(row)" />
              </template>
            </el-table-column>

            <el-table-column label="小计" prop="subtotal" min-width="120">
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
            <el-input style="width: 200px;  " v-model="quoteData.totalPrice" readonly  />
          </el-form-item>

          <!-- 操作按钮 -->
          <el-form-item>
            <el-button type="success" @click="submitQuote">提交报价</el-button>
            <el-button type="warning" @click="exportToPDF">导出 PDF</el-button>
            <el-button type="primary" @click="">发送邮件</el-button>
          </el-form-item>

        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>


<script setup>

import { useCustomersDataStore } from "@/stores/fetchCustomerData";
import { GetProductDataStore } from "@/stores/ProductInfo";
import { ref, reactive, onMounted } from "vue";

/** 客户个人信息（Pinia）Created By Zane Xu 2025-3-13 */
const CustomerData = useCustomersDataStore()

/** 产品信息（Pina）Created By Zane Xu 2025-3-13 */
const ProductData =  GetProductDataStore()

const quoteData = reactive({
  customer: null,   // 储存的是客户的ID
  email: "",
  phone: "",
  products:[],
  totalPrice:0, // 默认总价
});



// **获取客户 & 产品数据**
onMounted(async () => {
  CustomerData.getCustomerData()
  ProductData.GetProductData()
});

/** 更新客户信息 Created By Zane Xu 2025-3-13*/
const updateCustomerInfo = () => {
  const selectedCustomer = CustomerData.CustomersData.find(cust => cust.CustomerID === quoteData.customer);
  if (selectedCustomer) {
    quoteData.email = selectedCustomer.Email;
    quoteData.phone = selectedCustomer.ContactNumber;
  }
};

/** 添加产品 Created By Zane Xu 2025-3-13 */
const addProduct = () => {
  quoteData.products.push({ product: null,unit:"", price: 0, quantity: 1, subtotal: 0 });
};

/** 更新产品价格 Created By Zane Xu 2025-3-13 */
const updatePrice = (row) => {
  // console.log(row);
  const selectedOrder = ProductData.ProductData.find(cust => cust.ProductID === row.product)
  // console.log(selectedOrder);
  if (selectedOrder) {
      row.price = selectedOrder.UnitPrice
      row.unit = selectedOrder.Unit
      row.subtotal  = row.price * row.quantity
      calculateSubtotal(row);
  };
}

// **计算小计**
const calculateSubtotal = (row) => {
  row.subtotal = row.price * row.quantity;
  calculateTotalPrice();
};

/** 计算总价 Created By Zane Xu 2025-3-13 */
const calculateTotalPrice = () => {
  quoteData.totalPrice = quoteData.products.reduce((sum, item) => sum + item.subtotal, 0);
};

/** 删除产品  Created By Zane Xu 2025-3-13 */
const removeProduct = (index) => {

};

// **提交报价**
const submitQuote = () => {
  ElMessage.success("报价单已提交！");
};

// **导出 PDF**
const exportToPDF = () => {
  ElMessage.success("报价单已导出 PDF！");
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

