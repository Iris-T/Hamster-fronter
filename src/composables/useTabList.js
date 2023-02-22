import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { router } from "@/router";

export function useTabList() {
  const route = useRoute();

  const activeTab = ref(route.path);
  const tabList = ref([
    {
      title: "后台首页",
      path: "/",
    },
  ]);

  // 初始化标签导航栏
  function initTabList() {
    let tbs = JSON.parse(localStorage.getItem("tabList"));
    if (tbs) {
      tabList.value = tbs;
    }
  }
  initTabList();

  // 添加标签导航
  function addTab(tab) {
    // 未找到tab
    let noTab = tabList.value.findIndex((t) => t.path == tab.path) == -1;
    if (noTab) {
      tabList.value.push(tab);
    }
    localStorage.setItem("tabList", JSON.stringify(tabList.value));
  }

  // 删除标签导航
  const removeTab = (t) => {
    let a = activeTab.value;
    let tabs = tabList.value;
    if (a == t) {
      tabs.forEach((tab, index) => {
        if (tab.path == t) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            a = nextTab.path;
          }
        }
      });
    }

    activeTab.value = a;
    tabList.value = tabList.value.filter((tab) => tab.path != t);
    localStorage.setItem("tabList", JSON.stringify(tabList.value));
  };

  const changeTab = (t) => {
    activeTab.value = t;
    router.push(t);
  };

  onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path;
    addTab({
      title: to.meta.title,
      path: to.path,
    });
  });

  const handleCloseTag = (e) => {
    if (e == "clearAll" || (e == "clearOther" && activeTab.value == "/")) {
      // 切换回首页
      activeTab.value = "/";
      // tagList赋值
      tabList.value = [
        {
          title: "后台首页",
          path: "/",
        },
      ];
    } else if (e == "clearOther") {
      let tabs = [];
      // 过滤
      tabList.value.forEach((t) => {
        if (t.path == activeTab.value || t.path == "/") tabs.push(t);
      });
      tabList.value = tabs;
    }
    // 刷新缓存数据
    localStorage.setItem("tabList", JSON.stringify(tabList.value));
  };

  return {
    activeTab,
    tabList,
    removeTab,
    changeTab,
    handleCloseTag,
  };
}
