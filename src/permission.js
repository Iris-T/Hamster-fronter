import { router, addRoutes } from "@/router";
import { warning, showFullLoading, hideFullLoading } from "@/composables/util";
import store from "./store";

// 全局前置守卫
let hasGetInfo = false;
router.beforeEach(async (to, from, next) => {
  // 显示页面加载图标
  showFullLoading();

  const authorization = localStorage.getItem("authorization");
  // 未授权则强制跳转到登录页
  if (!authorization && to.path != "/login") {
    warning("请登录后访问");
    next({ path: "/login" });
  }
  // 禁止重复登录
  if (authorization && to.path == "/login") {
    warning("已登录,无需重复操作");
    next({ path: from.path ? from.path : "/" });
  }

  // 登录获取用户信息并存储在vuex中
  if (authorization && !hasGetInfo) {
    // 同步等待获取信息
    let res = await store.dispatch("userinfo");
    hasGetInfo = true;
    // 动态添加路由
    await addRoutes(res.data.menu);
    router.push(to.path);
  }

  let title = (to.meta.title ? to.meta.title + "-" : "") + "仓鼠物流管理系统";
  document.title = title;

  next();
});

// 全局后置守卫
router.afterEach((to, from) => hideFullLoading());
