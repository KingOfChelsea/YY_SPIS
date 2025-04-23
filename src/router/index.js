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
import Permission from "@/views/Permission/index.vue"
import Roles from "@/views/Roles/index.vue"
import Email from "@/views/SaleEmail/index.vue"
import OrderList from "@/H5/Customers/index.vue"
import Sign from "@/views/Sign/index.vue"
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
        {
          path:"/system/permissions",
          name:"",
          component:Permission
        },
        {
          path:"/system/roles",
          name:"",
          component:Roles
        },
        {
          path:"/sales/email",
          name:"",
          component:Email
        },

      ],
    },
    {
      path: "/login",
      name:Login,
      component: Login,
    },
    {
      path: "/sign",
      name:Sign,
      component: Sign,
    },
    {
      path: "/H5/",
      name:"",
      component: OrderList,
    },
  ],
});


/**全局路由守卫 Add By Zane Xu 2025-3-6 */
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('Token');
  console.log('当前 Token:', token);

  // 无需验证 Token 的白名单页面
  const publicPages = ['/login', '/sign'];

  // 有 token 的情况
  if (token) {
    const res = await verifyTokenAPI(token);
    if (res.success) {
      localStorage.setItem('userData', JSON.stringify(res.data));
      if (to.path === '/login') {
        next('/'); // 如果已登录仍访问 login，则跳转首页
      } else {
        next(); // 正常访问其他页面
      }
      return;
    } else {
      // Token 无效，清除并重定向
      localStorage.removeItem('Token');
      localStorage.removeItem('userData');
      if (publicPages.includes(to.path)) {
        next(); // 允许访问 /login 或 /sign
      } else {
        next('/login');
      }
      return;
    }
  }

  // 没有 token 的情况
  if (!token && !publicPages.includes(to.path)) {
    next('/login'); // 非白名单页面重定向
    return;
  }

  next(); // 白名单页面放行
});










export default router;
