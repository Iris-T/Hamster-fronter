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
export function changeStatus(module, id, status) {
  return axios.post(`/admin/${module}/${id}/changeStatus`, status, {
    headers: { "Content-Type": "application/json" },
  });
}

// 新增用户信息
export function moduleObjAdd(module, obj) {
  return axios.post(`/admin/${module}/add`, obj);
}

// 修改用户信息
export function moduleObjUpdate(module, id, obj) {
  return axios.post(`/admin/${module}/${id}/update`, obj);
}
