import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login/index.vue";
import Layout from "@/views/Layout/index.vue";
import Home from "@/views/Home/index.vue";
import PurchaseCreat from "@/views/PurchaseCreate/index.vue"
import PurchaseApprove from "@/views/PurchaseApprove/index.vue"
import PurchaseRecord from "@/views/PurchaseRecord/index.vue"
import PurchaseSupplier from "@/views/PurchaseSupplier/index.vue"
import PurchaseCheck from "@/views/PurchaseCheck/index.vue"
import ProductAdd from "@/views/ProductAdd/index.vue"
import IndexDashboard from "@/views/IndexDashboard/index.vue"
import InventoryWarehouse from "@/views/InventoryWarehouse/index.vue"
import Inventory from "@/views/InventoryAllocation/index.vue"
import Transfer from "@/views/InventoryTransfer/index.vue"
import { verifyTokenAPI } from "@/apis/login/verifyTokenAPI";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Layout",
      component: Layout,
      children: [
        {
          path: "",
          name: "Home",
          component: Home, // 默认首页组件
        },
        {
          path: "purchase/create",
          name: "",
          component: PurchaseCreat, // 创建采购订单
        },
        {
          path: "purchase/approve",
          name: "",
          component: PurchaseApprove, // 默认首页组件
        },
        {
          path: "purchase/record",
          name: "",
          component: PurchaseRecord, // 默认首页组件
        },
        {
          path: "purchase/supplier",
          name: "",
          component: PurchaseSupplier, // 默认首页组件
        },
        {
          path: "purchase/check",
          name: "",
          component: PurchaseCheck, // 默认首页组件
        },
        {
          path: "product/add",
          name: "",
          component: ProductAdd, // 默认首页组件
        },
        {
          path: "index/dashboard",
          name: "",
          component: IndexDashboard, // 默认首页组件
        },
        {
          path: "inventory/warehouse",
          name: "",
          component: InventoryWarehouse, // 默认首页组件
        },
        {
          path: "inventory/allocation",
          name: "",
          component: Inventory, // 默认首页组件
        },
        {
          path: "inventory/transfer",
          name: "",
          component: Transfer, // 默认首页组件
        },



      ],
    },
    {
      path: "/login",
      name:Login,
      component: Login,
    },
  ],
});


// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('Token');

  // 如果有 token 且目标路由是登录页，则自动重定向到首页 '/'
  if (token && to.path === '/login') {
    const res = await verifyTokenAPI(token);
    if (res.success) {
      localStorage.setItem('userData', JSON.stringify(res.data));
      next('/');  // 跳转到首页
      return;  // 防止后续逻辑执行
    }else{
      localStorage.removeItem('Token');
      localStorage.removeItem('userData');
      next('/login'); // 跳转到登录页面
    }


  }

  // 如果没有 token 且目标路由不是登录页，重定向到登录页
  if (!token && to.path !== '/login') {
    next('/login');  // 跳转到登录页
    return;  // 防止后续逻辑执行
  }
  // 如果目标路由是登录页或其他有效页面，继续访问
  next();
});








export default router;
