import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconVue from "@element-plus/icons-vue";
import App from "@/App.vue";
import { router } from "@/router";
import store from "@/store";
import "virtual:windi.css";
import "@/style.css";
import "@/permission";
import "default-passive-events";
import permission from "@/directives/permission";

const app = createApp(App);
app.use(permission);
app.use(router);
app.use(store);
app.use(ElementPlus);
app.config.globalProperties.$icons = [];
for (const [key, component] of Object.entries(ElementPlusIconVue)) {
  app.config.globalProperties.$icons.push(key);
  app.component(key, component);
}
app.mount("#app");
