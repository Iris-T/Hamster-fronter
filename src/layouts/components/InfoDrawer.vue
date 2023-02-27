<template>
    <!-- 抽屉组件 -->
    <el-drawer v-model="showDrawer" :title="title" :size="size" :close-on-click-modal="false" :close-on-press-escape="false"
        :destory-on-close="destroyOnClose">
        <div class="formDrawer">
            <div class="formBody">
                <slot></slot>
            </div>
            <div class="formBtn">
                <el-button class="w-5/5 border-0" @click="close" color="#f0f0f0" round>关闭</el-button>
            </div>
        </div>
    </el-drawer>
</template>
  
<script setup>
import { ref } from "vue";

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
    }
})

// 向父组件暴露方法
defineExpose({
    open,
    close
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
  