import { createRouter, createWebHashHistory } from "vue-router";

import Index from "@/pages/index.vue";
import NotFound from "@/pages/404.vue";
import Login from "@/pages/login.vue";
import CoList from "@/pages/co/list.vue";
import UserList from "@/pages/system/userList.vue";
import RoleList from "@/pages/system/roleList.vue";
import PermsList from "@/pages/system/permsList.vue";
import SysField from "@/pages/system/SysField.vue"; 
import Admin from "@/layouts/admin.vue";

// 默认路由,所有用户共享
const routes = [
  {
    path: "/",
    name: "Admin",
    component: Admin,
    children: [
      {
        path: "/",
        name: "Index",
        component: Index,
        meta: {
          title: "后台首页",
        },
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

// 动态路由,用于匹配菜单,动态添加路由
const asyncRoutes = [
  {
    path: "/co/list",
    name: "CoList",
    component: CoList,
    meta: {
      title: "合作伙伴管理",
    },
  },
  {
    path: "/user/list",
    name: "UserList",
    component: UserList,
    meta: {
      title: "用户管理",
    },
  },
  {
    path: "/role/list",
    name: "RoleList",
    component: RoleList,
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/perms/list",
    name: "PermsList",
    component: PermsList,
    meta: {
      title: "权限管理",
    },
  },
  {
    path: "/sys/field",
    name: "SysField",
    component: SysField,
    meta: {
      title: "系统参数",
    },
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 动态添加路由
export function addRoutes(menus) {
  // 嵌套结构,递归过滤,有Component则进行注册路由
  const findRoutes = (arr) => {
    arr.forEach((node) => {
      let item = asyncRoutes.find((obj) => obj.path == node.path);
      // 判断组件和路由路径是否存在
      if (item && !router.hasRoute(item.path)) {
        router.addRoute("Admin", item);
      }
      // 嵌套查找
      if (node.children && node.children.length > 0) {
        findRoutes(node.children);
      }
    });
  };

  findRoutes(menus);
}
