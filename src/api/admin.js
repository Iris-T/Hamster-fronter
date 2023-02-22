import axios from "@/axios";

// 获取用户列表
export function queryList(
  path,
  queryObj = {
    keyword: "",
    cur: 1,
    size: 10,
  }
) {
  let q = [];
  for (const key in queryObj) {
    if (queryObj[key]) {
      q.push(`${key}=${encodeURIComponent(queryObj[key])}`);
    }
  }
  let query = q.join("&");
  query = query ? "?" + query : "";
  return axios.get(`/admin/${path}${query}`);
}

// 修改用户状态
export function changeStatus(module, uid, status) {
  return axios.post(`/admin/${module}/${uid}/changeStatus`, status, {
    headers: { "Content-Type": "application/json" },
  });
}

// 新增用户信息
export function userAdd(user) {
  return axios.post("/admin/user/add", user);
}

// 修改用户信息
export function userUpdate(uid, user) {
  return axios.post(`/admin/user/${uid}/update`, user);
}
