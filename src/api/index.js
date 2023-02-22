import axios from "@/axios";

// 获取卡片展示信息
export function getInfo() {
    return axios.get("/sys/getInfo");
}
// 获取车辆和仓库展示信息
export function facility() {
    return axios.get("/sys/facility");
}
// 获取运输图表展示信息
export function chartInfo(type) {
    return axios.get(`/sys/chartInfo?type=${type}`);
}