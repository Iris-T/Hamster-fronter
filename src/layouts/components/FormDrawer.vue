<template><!-- 抽屉组件 -->
  <el-drawer v-model="showDrawer" :title="title" :size="size" :close-on-click-modal="false" :close-on-press-escape="false"
    :destory-on-close="destroyOnClose">
    <div class="formDrawer">
      <div class="formBody">
        <slot></slot>
      </div>
      <div class="formBtn">
        <el-button @click="submit" class="w-2/5" color="#8b5cf6" :loading="loading" round>{{ confirmText }}</el-button>

        <el-button class="w-2/5" @click="close" color="#f0f0f0" round>取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";

const loading = ref(false)
// 显示/隐藏加载图标
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false

const showDrawer = ref(false);
// 开关抽屉
const open = () => (showDrawer.value = true);
const close = () => (showDrawer.value = false);

const props = defineProps({
  title: String,
  // 抽屉尺寸
  size: {
    type: String,
    default: "40%"
  },
  // 抽屉数据关闭后是否销毁
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  // 提交按钮文字
  confirmText: {
    type: String,
    default: "提交"
  },
})

// 向父组件暴露事件
const emits = defineEmits(["submit"])
// 提交
const submit = () => emits("submit")

// 向父组件暴露方法
defineExpose({
  open,
  close,
  showLoading,
  hideLoading,
});
</script>

<style lang="postcss" scoped>
.formDrawer {
  width: 100%;
  height: 100%;
  position: relative;
  @apply flex flex-col;
}

.formDrawer .formBody {
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}

.formDrawer .formBtn {
  height: 50px;
  @apply mt-auto flex items-center;
}
</style>
