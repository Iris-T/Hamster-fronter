import { router, addRoutes } from "@/router";
import { customNotification, showFullLoading, hideFullLoading } from "@/composables/util";
import store from "@/store";

let flag = false;
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 显示页面加载图标
  showFullLoading();

  const authorization = localStorage.getItem("authorization");
  if (!authorization && to.path != "/login") {
    customNotification("warning", "请登录后访问");
    next({ path: "/login" });
  }
  if (authorization && to.path == "/login") {
    warning("已登录,无需重复操作");
    next({ path: from.path ? from.path : "/" });
  }

  if (authorization) {
    if (!flag) {
      // 同步等待获取信息
      let res = await store.dispatch("userinfo");
      // 动态添加路由
      await addRoutes(res.data.menu);
      flag = true;
      router.push(to.path);
    }
  }

  // 设置页面标题
  let title = (to.meta.title ? to.meta.title + "-" : "") + "仓鼠物流管理系统";
  document.title = title;

  next();
});

// 全局后置守卫
router.afterEach((to, from) => hideFullLoading());
