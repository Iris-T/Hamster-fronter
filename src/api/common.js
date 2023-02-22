import axios from "@/axios";

export function checkIdNo(idNo) {
  return axios.post("/check/user/idNo", idNo, {
    headers: { "Content-Type": "application/json" },
  });
}

export function checkUsername(username) {
  return axios.post("/check/user/username", username, {
    headers: { "Content-Type": "application/json" },
  });
}
