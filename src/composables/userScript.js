import { ref, reactive } from "vue";
import { logout, reProfile, rePwd, userinfo } from "../api/user";
import { showModel, success, error } from "@/composables/util";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export function useRePwd() {
  const router = useRouter();
  const store = useStore();
  const formDrawerRef = ref(null);
  const formRef = ref(null);

  const rePwdObj = reactive({
    oldPassword: "",
    newPassword: "",
    reConfirmPassword: "",
  });

  const rePwdRules = {
    oldPassword: [
      {
        required: true,
        message: "原密码不能为空",
        trigger: "blur",
      },
    ],
    newPassword: [
      {
        required: true,
        message: "新密码不能为空",
        trigger: "blur",
      },
    ],
    reConfirmPassword: [
      {
        required: true,
        message: "二次确认密码不能为空",
        trigger: "blur",
      },
    ],
  };

  const rePwdSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return false;
      }
      formDrawerRef.value.showLoading();
      rePwd(rePwdObj)
        .then((res) => {
          if (res.data.code === 200) {
            success("更新密码成功,请重新登录");
            // 删除登录凭证
            store.dispatch("logout");
            router.push("/login");
          } else {
            error(res.data.msg);
          }
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };

  const openRePwdDrawer = () => formDrawerRef.value.open();

  return {
    formDrawerRef,
    formRef,
    rePwdObj,
    rePwdRules,
    rePwdSubmit,
    openRePwdDrawer,
  };
}

export function useReProfile() {
  const store = useStore();
  const formDrawerRef = ref(null);
  const formRef = ref(null);
  const reProfileObj = reactive({
    username: store.state.user.username,
    name: store.state.user.name,
    gender: store.state.user.gender,
    phone: store.state.user.phone,
    address: store.state.user.address,
  });

  const reProfileRules = {
    username: [
      {
        required: true,
        message: "用户名不能为空",
        trigger: "blur",
      },
    ],
    name: [
      {
        required: true,
        message: "姓名不能为空",
        trigger: "blur",
      },
    ],
    phone: [
      {
        required: true,
        message: "联系方式不能为空",
        trigger: "blur",
      },
    ],
    address: [
      {
        required: true,
        message: "联系地址不能为空",
        trigger: "blur",
      },
    ],
  };

  const reProfileSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return false;
      }
      formDrawerRef.value.showLoading();
      reProfile(reProfileObj)
        .then((res) => {
          if (res.data.code === 200) {
            userinfo();
            success(res.data.msg);
          } else {
            error(res.data.msg);
          }
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
          formDrawerRef.value.close();
        });
    });
  };

  const openReProfileDrawer = () => formDrawerRef.value.open();

  return {
    formDrawerRef,
    formRef,
    reProfileObj,
    reProfileRules,
    reProfileSubmit,
    openReProfileDrawer,
  };
}

export function useLogout() {
  const router = useRouter();
  const store = useStore();

  function handleLogout() {
    showModel("确认退出?")
      .then((res) => {
        logout().finally(() => {
          store.dispatch("logout");
          router.push("/login");
          success("注销成功");
        });
      })
      .catch(() => {});
  }

  return {
    handleLogout,
  };
}
