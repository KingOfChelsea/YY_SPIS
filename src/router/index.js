/**
 * @description:路由接口集成
 * @return {*}
 * @Author: Zane Xu
 * @Date: 2025-03-11 15:27:27
 * @LastEditTime: Do not edit
 * @LastEditors: Zane Xu
 */
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
import CustomerManagement from "@/views/CustomersMangement/index.vue"
import SalesOrder from "@/views/SalesOrderManagement/index.vue"
import SalesQuotation from "@/views/SalesQuotation/index.vue"
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
          component: PurchaseCreat,
        },
        {
          path: "purchase/approve",
          name: "",
          component: PurchaseApprove,
        },
        {
          path: "purchase/record",
          name: "",
          component: PurchaseRecord,
        },
        {
          path: "purchase/supplier",
          name: "",
          component: PurchaseSupplier, 
        },
        {
          path: "purchase/check",
          name: "",
          component: PurchaseCheck,
        },
        {
          path: "product/add",
          name: "",
          component: ProductAdd,
        },
        {
          path: "index/dashboard",
          name: "",
          component: IndexDashboard,
        },
        {
          path: "inventory/warehouse",
          name: "",
          component: InventoryWarehouse,
        },
        {
          path: "inventory/allocation",
          name: "",
          component: Inventory,
        },
        {
          path: "inventory/transfer",
          name: "",
          component: Transfer,
        },
        {
          path: "/sales/customerManage",
          name: "",
          component:CustomerManagement,
        },
        {
          path: "/sales/quoted",
          name: "",
          component:SalesQuotation,
        },
        {
          path: "/sales/ordermanagement",
          name: "",
          component:SalesOrder,
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


/**全局路由守卫 Add By Zane Xu 2025-3-6 */
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('Token');
// 有token，调用验证token接口，无过期存储用户资料并且直接进入系统，否则删除过期token。没有token，直接进入login界面
  if (token) {
    const res = await verifyTokenAPI(token);
    if (res.success) {
      localStorage.setItem('userData', JSON.stringify(res.data));
      if (to.path === '/login') {
        next('/'); // 仅当目标路由是 '/login' 时才跳转到首页
      } else {
        next(); // 继续访问目标路由
      }
      return; // 确保 `next()` 只调用一次
    } else {
      localStorage.removeItem('Token');
      localStorage.removeItem('userData');
      next('/login'); // Token 无效，跳转到登录页
      return; // 确保 `next()` 只调用一次
    }
  }

  if (!token && to.path !== '/login') {
    next('/login'); // 没有 token，跳转到登录页
    return; // 确保 `next()` 只调用一次
  }

  next(); // 允许访问目标页面（如 /login）
});









export default router;
