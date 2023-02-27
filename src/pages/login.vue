<template>
  <el-row class="login-container">
    <el-col :lg="14" :md="12" class="left">
      <el-image :src="logo"/>
      <div class="title">仓鼠物流运输管理系统</div>
    </el-col>
    <el-col :lg="10" :md="12" class="right">
      <h2 class="title">欢迎使用</h2>

      <div class="info-box">
        <span class="info-line"></span>
        <span>用户登录</span>
        <span class="info-line"></span>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" color="#8b5cf6" class="w-[250px]" type="primary" round @click="onSubmit">登
            录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import logo from "@/assets/logo.png";
import { success, error } from "@/composables/util";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
  ],
};

const formRef = ref(null);
const loading = ref(false);
const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }
    // 加载动画开始
    loading.value = true;
    store
      .dispatch("login", form)
      .then((res) => {
        // 提示信息
        if (res.code === 200) {
          // 跳转到主页
          router.push("/");
          success(res.msg);
        } else {
          error(res.msg);
        }
      })
      .catch((err) => {
        // 提示信息
        error(res.data.msg);
      })
      .finally(() => {
        // 加载动画结束
        loading.value = false;
      });
  });
};

// 监听键盘回车事件
function onKeyUp(e) {
  if (e.key === "Enter") onSubmit();
}
// 添加键盘监听
onMounted(() => {
  document.addEventListener("keyup", onKeyUp);
});
// 移除键盘监听
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>

<style lang="postcss" scoped>
.login-container {
  @apply bg-purple-500 min-h-screen;
}

.login-container .left,
.login-container .right {
  @apply flex flex-col items-center justify-center;
}

.login-container .right {
  @apply bg-gray-100;
}

.left .title {
  @apply font-bold text-2xl text-gray-100;
}

.right .title {
  @apply font-bold text-3xl text-gray-800;
}

.right .info-box {
  @apply flex items-center justify-center my-5 text-gray-400 font-bold;
}

.right .info-line {
  @apply h-[3px] w-16 bg-gray-200;
}
</style>
