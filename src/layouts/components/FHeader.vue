<template>
  <div class="f-header">
    <!-- Logo -->
    <el-image :src="logo" class="logo"></el-image>
    <span class="font-bold">仓鼠物流运输管理系统</span>

    <el-tooltip content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh">
        <refresh />
      </el-icon>
    </el-tooltip>

    <div class="user-block">
      <div>
        <el-tooltip :content="!isFullscreen ? '全屏查看' : '关闭全屏'" placement="bottom">
          <el-icon class="icon-btn" @click="toggle">
            <full-screen v-if="!isFullscreen" />
            <CircleClose v-else />
          </el-icon>
        </el-tooltip>
      </div>

      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="el-dropdown-link">
          欢迎使用，{{ $store.state.user.username }}({{ $store.state.user.name }})
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="reProfile">修改个人信息</el-dropdown-item>
            <el-dropdown-item command="rePwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 修改密码抽屉 -->
  <form-drawer ref="rePwdFormDrawerRef" title="修改密码" destroyOnClose @submit="rePwdSubmit">
    <el-form ref="rePwdFormRef" :rules="rePwdRules" :model="rePwdObj" label-width="80px">
      <el-form-item prop="oldPassword" label="旧密码">
        <el-input type="password" show-password v-model="rePwdObj.oldPassword" placeholder="请输入原密码" />
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input type="password" show-password v-model="rePwdObj.newPassword" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item prop="reConfirmPassword" label="再次确认">
        <el-input type="password" show-password v-model="rePwdObj.reConfirmPassword" placeholder="请再次确认密码" />
      </el-form-item>
    </el-form>
  </form-drawer>

  <!-- 修改个人信息抽屉 -->
  <form-drawer ref="reProfileFormDrawerRef" title="更新个人信息" destoryOnClose @submit="reProfileSubmit()">
    <el-form ref="reProfileFormRef" :rules="reProfileRules" :model="reProfileObj" label-width="80px">
      <el-form-item prop="username" label="用户名">
        <el-input type="text" v-model="reProfileObj.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input type="text" v-model="reProfileObj.name" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="reProfileObj.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="phone" label="联系方式">
        <el-input type="text" v-model="reProfileObj.phone" placeholder="联系方式" />
      </el-form-item>
      <el-form-item prop="address" label="联系地址">
        <el-input type="text" v-model="reProfileObj.address" placeholder="联系地址" />
      </el-form-item>
    </el-form>
  </form-drawer>
</template>

<script setup>
import { useFullscreen } from "@vueuse/core";
import FormDrawer from "@/layouts/components/FormDrawer.vue";
import { useRePwd, useLogout, useReProfile } from "@/composables/userScript"

import logo from "@/assets/logo.png";

const {
  isFullscreen,
  toggle
} = useFullscreen();
const {
  formDrawerRef: rePwdFormDrawerRef,
  formRef: rePwdFormRef,
  rePwdObj,
  rePwdRules,
  rePwdSubmit,
  openRePwdDrawer
} = useRePwd();
const {
  formDrawerRef: reProfileFormDrawerRef,
  formRef: reProfileFormRef,
  reProfileObj,
  reProfileRules,
  reProfileSubmit,
  openReProfileDrawer
} = useReProfile();
const {
  handleLogout
} = useLogout();

function handleCommand(c) {
  switch (c) {
    case "logout":
      handleLogout();
      break;
    case "rePwd":
      openRePwdDrawer();
      break;
    case "reProfile":
      openReProfileDrawer();
      break;
  }
}

// 页面刷新
const handleRefresh = () => location.reload();
</script>

<style lang="postcss" scoped>
.f-header {
  @apply flex items-center text-light-50 bg-purple-500 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 100;
}

.logo {
  @apply w-16 h-16 mr-1;
}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-purple-400;
}

.user-block {
  @apply ml-auto flex justify-center items-center font-bold;
}

.f-header .dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center text-light-100 mx-5;
}
</style>
