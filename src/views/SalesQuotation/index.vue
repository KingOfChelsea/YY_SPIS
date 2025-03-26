<!--
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-11 15:11:30
 * @LastEditTime: 2025-03-26 09:09:52
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
            <el-select v-model="CustomerInfo.CustomerID" placeholder="选择客户" @change="updateCustomerInfo">
              <el-option v-for="cust in CustomerData.CustomersData" :key="cust.CustomerID"
                :label="`编号:${cust.CustomerID} | 姓名:${cust.CustomerName}`" :value="cust.CustomerID" />
            </el-select>
          </el-form-item>

          <!-- 关联邮箱 -->
          <el-form-item label="客户邮箱">
            <el-input v-model="CustomerInfo.email" readonly placeholder="自动填充客户邮箱" />
          </el-form-item>

          <!-- 关联电话 -->
          <el-form-item label="客户电话">
            <el-input v-model="CustomerInfo.phone" readonly placeholder="自动填充客户电话" />
          </el-form-item>

          <el-scrollbar max-height="200px">
            <!--  -----报价单------  -->
            <el-table :data="quoteData.OrderDetails" border stripe>

              <el-table-column label="产品ID" prop="ProductID" width="180">
                <template #default="{ row }">
                  <el-select v-model="row.ProductID" placeholder="选择产品" @change="updatePrice(row)">
                    <el-option v-for="prod in ProductData.ProductData" :key="prod.ProductID"
                      :label="`${prod.ProductID}-${prod.ProductName}`" :value="prod.ProductID" />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="产品名称" prop="ProductName" max-width="180">
                <template #default="{ row }">
                  <el-input readonly v-model="row.ProductName" ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="单价" prop="Price" max-width="150">
                <template #default="{ row }">
                  <el-input v-model="row.Price" readonly />
                </template>
              </el-table-column>
              <!-- <el-table-column label="单位" prop="unit" max-width="150">
                <template #default="{ row }">
                  <el-input v-model="row.unit" readonly />
                </template>
              </el-table-column> -->

              <el-table-column label="数量" prop="Quantity" min-width="180">
                <template #default="{ row }">
                  <el-input-number v-model="row.Quantity" :min="1" @change="calculateSubtotal(row)" />
                </template>
              </el-table-column>

              <el-table-column label="小计" prop="SubTotal" min-width="120">
                <template #default="{ row }">
                  <el-input v-model="row.SubTotal" readonly />
                </template>
              </el-table-column>

              <el-table-column label="操作" width="80">
                <template #default="{ row, $index }">
                  <el-button type="danger" size="small" @click="removeProduct($index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>

          <el-button type="primary" @click="addProduct" class="add-btn">添加产品</el-button>

          <!-- 总价 -->
          <el-form-item label="总价" class="total-price">
            <el-input style="width: 200px;  " v-model="quoteData.TotalAmount" readonly />
          </el-form-item>

          <!-- 操作按钮 -->
          <el-form-item>
            <el-button type="success" @click="submitQuote">提交报价</el-button>
          </el-form-item>

        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>


<script setup>

import { SnedQuotationAPI } from "@/apis/sales/sendQuotation";
import { useCustomersDataStore } from "@/stores/fetchCustomerData";
import { GetProductDataStore } from "@/stores/ProductInfo";
import { reactive, onMounted, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { insertSalesOrderAPI } from "@/apis/sales/insertSalesOrder";


/** 客户个人信息（Pinia）Created By Zane Xu 2025-3-13 */
const CustomerData = useCustomersDataStore()


/** 产品信息（Pina）Created By Zane Xu 2025-3-13 */
const ProductData = GetProductDataStore()
const CustomerInfo = reactive({
  CustomerID:null,
  email: "",
  phone: "",
})

const quoteData = reactive({
  CustomerID:null,
  TotalAmount: 0, // 默认总价
  Status:"Pending",
  OrderDetails: [],
});

/**监听客户信息，并且放入quoteData中使用 Zane Xu 2025-3-25 */
watch(()=> CustomerInfo.CustomerID,(newValue) =>{
  quoteData.CustomerID =newValue
})

// **获取客户 & 产品数据**
onMounted(async () => {
  CustomerData.getCustomerData()
  ProductData.GetProductData()
});

/** 更新客户信息 Created By Zane Xu 2025-3-13*/
const updateCustomerInfo = () => {
  const selectedCustomer = CustomerData.CustomersData.find(cust => cust.CustomerID === CustomerInfo.CustomerID);
  if (selectedCustomer) {
    CustomerInfo.email = selectedCustomer.Email;
    CustomerInfo.phone = selectedCustomer.ContactNumber;
  }
};

/** 添加产品 Created By Zane Xu 2025-3-13 */
const addProduct = () => {
  // 产品ID，产品单位，产品单价，产品数量，产品价格总计
  quoteData.OrderDetails.push({ ProductID: null, ProductName:"",Price: "",  Quantity: 1, SubTotal: 0 });
};

/** 更新产品价格 Created By Zane Xu 2025-3-13 */
const updatePrice = (row) => {
  const selectedOrder = ProductData.ProductData.find(cust => cust.ProductID === row.ProductID)
  if (selectedOrder) {
    row.ProductName = selectedOrder.ProductName
    row.Price = selectedOrder.UnitPrice
    row.SubTotal = row.Price * row.Quantity
    calculateSubtotal(row);
  };
}

// **计算小计**
const calculateSubtotal = (row) => {
  row.SubTotal = row.Price * row.Quantity;
  calculateTotalPrice();
};

/** 计算总价 Created By Zane Xu 2025-3-13 */
const calculateTotalPrice = () => {
  quoteData.TotalAmount = quoteData.OrderDetails.reduce((sum, item) => sum + item.SubTotal, 0);
};

/** 删除产品  Created By Zane Xu 2025-3-13 */
const removeProduct = (index) => {
  quoteData.OrderDetails.splice(index,1)
  calculateSubtotal()
};

/** 提交报价并发送至对应客户邮箱 Created By Zane Xu 2025-3-18 */

const submitQuote = async () => {
  try {
    // 弹窗
    ElMessageBox.confirm(`是否发送邮件给${CustomerInfo.email}客户`, `${CustomerInfo.email}的邮件`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
    )
      .then(async() => {
        const result = await insertSalesOrderAPI(quoteData)
        const res = await SnedQuotationAPI(CustomerInfo.email,result.orderId)
        if (res.success && result.success) {
          ElMessage.success(`已发送至${CustomerInfo.email}的邮箱！`);
        }
      }).catch((error) => {
        ElMessage({
          type: 'error',
          message: error,
        })
      })
  } catch (error) {
    ElMessage.error("错误：", error)
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
