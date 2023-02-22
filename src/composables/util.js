import { ElNotification, ElMessageBox } from "element-plus";
import nprogress from "nprogress";

export function success(msg) {
  return ElNotification({
    message: msg,
    type: "success",
    duration: 2500,
  });
}

export function error(msg) {
  return ElNotification({
    message: msg,
    type: "error",
    duration: 2500,
  });
}

export function warning(msg) {
  return ElNotification({
    message: msg,
    type: "warning",
    duration: 2500,
  });
}

export function info(msg) {
  return ElNotification({
    message: msg,
    type: "info",
    duration: 2500,
  });
}

export function showModel(content = "提示内容", type = "warning", title = "") {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type,
  });
}

// 显示全屏loading
export function showFullLoading() {
  nprogress.start();
}

// 隐藏全屏loading
export function hideFullLoading() {
  nprogress.done();
}

// 根据字符串生成颜色
export function extractColorByName(name) {
  var temp = [];
  temp.push("#");
  for (let index = 0; index < name.length; index++) {
    temp.push(parseInt(name[index].charCodeAt(0), 10).toString(16));
  }
  return temp.slice(0, 5).join("").slice(0, 4);
}

// 正则判断固话或手机号
export function isPhoneNo(str) {
  return (
    /\d{3}-\d{8}|\d{4}-\d{7}/.test(str) ||
    /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|(147))\\d{8}$/.test(
      str
    )
  );
}

// 正则判断身份证号
export function isChinaIdNo(str) {
  return (
    /^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$/.test(str) ||
    /^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9Xx])$/.test(
      str
    )
  );
}

// 正则判断邮箱
export function isEmail(str) {
  return /^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/.test(str);
}

// 判断非负浮点数
export function isPositiveFloat(num) {
  return /[1-9]\\d*\\.\\d*|0\\.\\d*[1-9]\\d*$/.test(num);
}
