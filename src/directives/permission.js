import store from "@/store";

function hasRoleOrPerm(value, el = false) {
  if (!Array.isArray(value)) {
    throw new Error("访问权限组件参数格式错误,示例格式v-permission=['','']");
  }
  const hasAuth =
    value.findIndex((v) => store.state.authority.includes(v)) != -1;
  if (el && !hasAuth) {
    el.parentNode && el.parentNode.removeChild(el);
  }
  return hasAuth;
}

export default {
  install(app) {
    app.directive("permission", {
      mounted(el, binding) {
        hasRoleOrPerm(binding.value, el);
      },
    });
  },
};
