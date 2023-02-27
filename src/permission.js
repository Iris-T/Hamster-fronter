import { router, addRoutes } from "@/router";
import { warning, showFullLoading, hideFullLoading } from "@/composables/util";
import store from "@/store";

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 显示页面加载图标
  showFullLoading();

  const authorization = localStorage.getItem("authorization");
  if (!authorization && to.path != "/login") {
    warning("请登录后访问");
    next({ path: "/login" });
  }
  if (authorization && to.path == "/login") {
    warning("已登录,无需重复操作");
    next({ path: from.path ? from.path : "/" });
  }
  let hasGetInfo = false;
  if (authorization) {
    if (!hasGetInfo) {
      // 同步等待获取信息
      let res = await store.dispatch("userinfo");
      // 动态添加路由
      hasGetInfo = addRoutes(res.data.menu);
    }
  }

  // 设置页面标题
  let title = (to.meta.title ? to.meta.title + "-" : "") + "仓鼠物流管理系统";
  document.title = title;

  hasGetInfo ? next(to.fullPath) : next();
});

// 全局后置守卫
router.afterEach((to, from) => hideFullLoading());
