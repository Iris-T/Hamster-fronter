import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconVue from "@element-plus/icons-vue";
import App from "@/App.vue";
import { router } from "@/router";
import store from "@/store";
import "virtual:windi.css";
import "./permission";
import "default-passive-events";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconVue)) {
  app.component(key, component);
}

app.use(router);
app.use(store);
app.use(ElementPlus);
app.mount("#app");