import { createStore } from "vuex";
import { login, userinfo } from "@/api/user";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},
      // 用户权限信息
      authority: [],
      // 菜单数据
      menu: [],
    };
  },
  mutations: {
    // 记录用户和权限信息
    SET_USERINFO(state, user) {
      state.user = user;
    },
    SET_AUTHORITY(state, authority) {
      state.authority = authority;
    },
    SET_MENU(state, menu) {
      state.menu = menu;
    },
  },

  actions: {
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        localStorage.removeItem("authorization");
        localStorage.removeItem("tabList");
        commit("SET_USERINFO", {});
        commit("SET_AUTHORITY", []);
        commit("SET_MENU", []);
        login(username, password)
          .then((res) => {
            if (res.data.code === 200) {
              // 存储token
              localStorage.setItem("authorization", res.headers.authorization);
            }
            resolve(res.data);
          })
          .catch((err) => reject(err));
      });
    },
    // 获取当前登录用户信息
    userinfo({ commit }) {
      return new Promise((resolve, reject) => {
        userinfo()
          .then((res) => {
            commit("SET_USERINFO", res.data.data.info);
            commit("SET_AUTHORITY", res.data.data.authority);
            commit("SET_MENU", res.data.data.menu);
            resolve(res.data);
          })
          .catch((err) => reject(err));
      });
    },
    // 退出登录,删除信息
    logout({ commit }) {
      localStorage.removeItem("authorization");
      localStorage.removeItem("tabList");
      commit("SET_USERINFO", {});
      commit("SET_AUTHORITY", []);
      commit("SET_MENU", []);
    }
  },
});

export default store;
