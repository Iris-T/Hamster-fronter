import axios from "axios";
import { error, warning } from "./composables/util";
import { useRouter } from "vue-router";
import store from "@/store/index.js";

const service = axios.create({
  baseURL: "/api",
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 请求头添加token
    const authorization = localStorage.getItem("authorization");

    // token赋值
    if (authorization) {
      config.headers["authorization"] = authorization;
    }
    // 在发送请求之前做些什么
    return config;
  },
  function (err) {
    // 对请求错误做些什么
    error("请求失败");
    return Promise.reject(err);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 拦截token并存储
    const authorization = response.headers.get("authorization");
    if (authorization) {
      localStorage.setItem("authorization", authorization);
    }
    return response;
  },
  function (err) {
    // Token失效则清空本地缓存
    if (err.response.status === 401) {
      store.dispatch("logout").finally(() => {
        location.reload();
      });
      warning("无认证访问");
    } else {
      error(err.response.data.msg || "服务器错误");
    }
    return Promise.reject(err);
  }
);

export default service;
