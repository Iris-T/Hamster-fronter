import axios from "@/axios";

// 重置对象密码
export function resetUserPwd(id) {
  return axios.post(`/admin/user/${id}/pwd/reset`);
}

// 获取对象列表
export function queryList(
  module,
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
  return axios.get(`${module}/list${query}`);
}

// 修改对象状态
export function changeStatus(module, id, status) {
  return axios.post(`/${module}/${id}/changeStatus`, status, {
    headers: { "Content-Type": "application/json" },
  });
}

// 新增对象信息
export function moduleObjAdd(module, obj) {
  return axios.post(`/${module}/add`, obj);
}

// 修改对象信息
export function moduleObjUpdate(module, id, obj) {
  return axios.post(`/${module}/${id}/update`, obj);
}

// 导出数据模板
export function exportTemplate(module) {
  return axios.get(`/${module}/export/template`, { responseType: "blob" });
}

// 导出数据记录
export function exportData(module, queryObj = { keyword: "" }) {
  let q = [];
  for (const key in queryObj) {
    if (queryObj[key]) {
      q.push(`${key}=${encodeURIComponent(queryObj[key])}`);
    }
  }
  let query = q.join("&");
  query = query ? "?" + query : "";
  return axios.get(`${module}/export/data${query}`, { responseType: "blob" });
}

// 导入数据
export function importData(module, file) {
  let data = new FormData();
  data.append("file", file);
  return axios.post(`${module}/import`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
